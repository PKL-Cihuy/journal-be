import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Types } from 'mongoose';

import { EPKLStatus, EUserType } from '@/db/interface';
import { PaginatedDTO } from '@/dto/global/paginated.dto';
import {
  PKLCreateDTO,
  PKLCreateFilesDTO,
  PKLDetailResponseDTO,
  PKLGetCreateDataResponseDTO,
  PKLListQueryDTO,
  PKLListResponseDTO,
  PKLTimelineListResponseDTO,
} from '@/dto/pkl';
import { PKLMessage } from '@/message';
import {
  PKLGetCreateDataPipeline,
  PKLGetDetailPipeline,
  PKLListPipeline,
  PKLTimelineListPipeline,
} from '@/pipeline/pkl';
import {
  MahasiswaRepository,
  PKLRepository,
  PKLTimelineRepository,
} from '@/repository';
import { formatPaginationResponse } from '@/util/formatResponse.util';
import { Forbidden, InternalServerError, NotFound } from '@/util/response.util';

import { FileService } from './file.service';

@Injectable({ scope: Scope.REQUEST })
export class PKLService {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,
    private readonly PKLRepository: PKLRepository,
    private readonly PKLTimelineRepository: PKLTimelineRepository,
    private readonly mahasiswaRepository: MahasiswaRepository,

    private readonly fileService: FileService,
  ) {}

  /**
   * List PKL by user type and filter by query
   *
   * @param {PKLListQueryDTO} query Query to filter PKL data
   *
   * @returns List of populated PKL data
   */
  async listPKL(
    query: PKLListQueryDTO,
  ): Promise<PaginatedDTO<PKLListResponseDTO>> {
    const { mhsId, dosenId } = this.req.user!;

    // List all populated PKL data or by filter
    const data = await this.PKLRepository.aggregate(
      PKLListPipeline(query, {
        mahasiswaId: mhsId,
        koordinatorId: dosenId,
      }),
    );

    // Return formatted pagination response
    return formatPaginationResponse(data);
  }

  /**
   * Get data for creating PKL (intended for Mahasiswa)
   *
   * @returns Data for creating PKL
   *
   * @throws {Forbidden} User is not Mahasiswa
   * @throws {NotFound} Mahasiswa not found
   */
  async getCreateData(): Promise<PKLGetCreateDataResponseDTO> {
    const { type, mhsId } = this.req.user!;

    // Check if user is Mahasiswa
    if ((type as EUserType) !== EUserType.MAHASISWA || !mhsId) {
      throw new Forbidden(PKLMessage.CREATE_PKL_NOT_MAHASISWA);
    }

    // Check if Mahasiswa exist
    const mhs = await this.mahasiswaRepository.getOneOrFail(mhsId, {
      projection: { _id: 1 },
    });

    // Get Mahasiswa data with populated Fakultas, Program Studi, and Dosen koordinator
    const data = await this.mahasiswaRepository.aggregate(
      PKLGetCreateDataPipeline(mhs._id),
    );

    return data[0];
  }

  /**
   * Create PKL for the current user Mahasiswa
   *
   * @param {PKLCreateDTO} data PKL data
   * @param {PKLCreateFilesDTO} files PKL files
   *
   * @throws {Forbidden} User is not Mahasiswa
   * @throws {NotFound} Mahasiswa not found
   * @throws {InternalServerError} Failed to create PKL, likely from FileService errors
   */
  async createPKL(data: PKLCreateDTO, files: PKLCreateFilesDTO) {
    // Get data for creating PKL for the current user mahasiswa
    const pklCreateData = await this.getCreateData();

    // Generate new PKL id
    const newPKLId = new Types.ObjectId();

    // Upload dokumen awal
    const { dokumenDiterima, dokumenMentor, dokumenPimpinan } =
      this.fileService.uploadDokumenAwal(String(newPKLId), {
        dokumenDiterima: files.dokumenDiterima,
        dokumenMentor: files.dokumenMentor,
        dokumenPimpinan: files.dokumenPimpinan,
      });

    try {
      // Create PKL
      await this.PKLRepository.create({
        _id: newPKLId,
        mahasiswaId: pklCreateData.mahasiswa._id as any,
        koordinatorId: pklCreateData.koordinator._id as any,
        fakultasId: pklCreateData.fakultas._id as any,
        prodiId: pklCreateData.programStudi._id as any,
        namaInstansi: data.namaInstansi,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
        dokumenDiterima: dokumenDiterima!,
        dokumenMentor: dokumenMentor!,
        dokumenPimpinan: dokumenPimpinan!,
        status: EPKLStatus.MENUNGGU_PERSETUJUAN,
      });

      // Create PKL timeline
      await this.PKLTimelineRepository.create({
        pklId: newPKLId,
        userId: pklCreateData.mahasiswa.userId as any,
        deskripsi: 'PKL diajukan',
        status: EPKLStatus.MENUNGGU_PERSETUJUAN,
      });
    } catch (error) {
      // Rollback if failed to create PKL
      console.error(error);

      // Delete created PKL
      await this.PKLRepository.deleteOne({ _id: newPKLId });

      // Delete uploaded files
      this.fileService.deleteFiles(this.fileService.PKL_FOLDER_NAME, [
        dokumenDiterima?.split(/[\\/]/)?.pop(),
        dokumenMentor?.split(/[\\/]/)?.pop(),
        dokumenPimpinan?.split(/[\\/]/)?.pop(),
      ]);

      throw new InternalServerError(
        PKLMessage.CREATE_FAIL_GENERIC,
        error.message,
      );
    }
  }

  /**
   * Get PKL detail by PKL id
   *
   * @param {string} pklId PKL id
   *
   * @returns Populated PKL data
   *
   * @throws {NotFound} PKL with id {pklId} not found
   * @throws {NotFound} User does not have access to PKL with id {pklId}
   */
  async getPKLDetail(pklId: string): Promise<PKLDetailResponseDTO> {
    const { mhsId, dosenId } = this.req.user!;

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
      dosenId,
    });

    // Get populated PKL data
    const data = await this.PKLRepository.aggregate(
      PKLGetDetailPipeline(pkl._id),
    );

    // Return first data since aggregation always return array
    return data[0];
  }

  /**
   * Get PKL timeline for a PKL by PKL id
   *
   * @param {string} pklId PKL id
   *
   * @returns List of populated PKL timeline data
   *
   * @throws {NotFound} PKL with id {pklId} not found
   * @throws {NotFound} User does not have access to PKL with id {pklId}
   */
  async listPKLTimeline(pklId: string): Promise<PKLTimelineListResponseDTO[]> {
    const { mhsId, dosenId } = this.req.user!;

    // Check if PKL exist
    // Prevent unauthorized access
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
      dosenId,
    });

    // Get populated PKL timeline data
    const timeline = await this.PKLTimelineRepository.aggregate(
      PKLTimelineListPipeline(pkl._id),
    );

    // Return timeline data
    return timeline;
  }
}
