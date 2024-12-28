import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Types, UpdateQuery } from 'mongoose';

import { EPKLStatus, EUserType, IPKL } from '@/db/interface';
import {
  PKLCreateDTO,
  PKLCreateFilesDTO,
  PKLGetCreateDataResponseDTO,
  PKLListQueryDTO,
  PKLUpdateDTO,
  PKLUpdateFilesDTO,
  PKLUpdateStatusDTO,
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
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from '@/util/response.util';

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
  async listPKL(query: PKLListQueryDTO) {
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
   */
  async getCreateData(isUpdate?: true): Promise<PKLGetCreateDataResponseDTO> {
    const { type, mhsId } = this.req.user!;

    // Check if user is Mahasiswa
    if ((type as EUserType) !== EUserType.MAHASISWA || !mhsId) {
      if (isUpdate) {
        throw new Forbidden(PKLMessage.FAIL_UPDATE_PKL_NOT_MAHASISWA);
      } else {
        throw new Forbidden(PKLMessage.FAIL_CREATE_PKL_NOT_MAHASISWA);
      }
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
   * @returns Created PKL data
   *
   * @throws {InternalServerError} Failed to create PKL, likely from FileService errors
   */
  async createPKL(data: PKLCreateDTO, files: PKLCreateFilesDTO) {
    // Get data for creating PKL for the current user mahasiswa
    const pklCreateData = await this.getCreateData();

    // Generate new PKL id
    const newPKLId = new Types.ObjectId();

    // Upload dokumen awal
    const { dokumenDiterima, dokumenMentor, dokumenPimpinan } =
      this.fileService.uploadPKLDokumenAwal(String(newPKLId), {
        dokumenDiterima: files.dokumenDiterima,
        dokumenMentor: files.dokumenMentor,
        dokumenPimpinan: files.dokumenPimpinan,
      });

    try {
      // Create PKL
      const created = await this.PKLRepository.create({
        _id: newPKLId,
        mahasiswaId: pklCreateData.mahasiswa._id as any,
        koordinatorId: pklCreateData.koordinator._id as any,
        fakultasId: pklCreateData.fakultas._id as any,
        prodiId: pklCreateData.programStudi._id as any,
        namaInstansi: data.namaInstansi,
        alamatInstansi: data.alamatInstansi,
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

      return created;
    } catch (error) {
      // Rollback if failed to create PKL
      console.error(error);

      // Delete created PKL
      await this.PKLRepository.deleteOne({ _id: newPKLId });

      // Delete uploaded files
      this.fileService.deleteFiles(this.fileService.PKL_FOLDER_NAME, [
        dokumenDiterima?.split('/')?.pop(),
        dokumenMentor?.split('/')?.pop(),
        dokumenPimpinan?.split('/')?.pop(),
      ]);

      throw new InternalServerError(
        PKLMessage.FAIL_CREATE_GENERIC,
        error.message,
      );
    }
  }

  /**
   * Update PKL by id
   *
   * @param {PKLCreateDTO} data PKL data
   * @param {PKLCreateFilesDTO} files PKL files
   *
   * @returns Updated PKL data
   *
   * @throws {BadRequest} PKL status is incorrect for update operation
   * @throws {InternalServerError} Failed to update PKL, likely from FileService errors
   */
  async updatePKL(pklId: string, data: PKLUpdateDTO, files: PKLUpdateFilesDTO) {
    // Get data for creating PKL for the current user mahasiswa
    const pklCreateData = await this.getCreateData(true);

    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

    // Throw BadRequest if PKL status is not correct
    if (
      pkl.status !== EPKLStatus.PENGAJUAN_DITOLAK &&
      pkl.status !== EPKLStatus.VERIFIKASI_GAGAL
    ) {
      throw new BadRequest(PKLMessage.FAIL_PKL_UPDATE_INCORRECT_STATUS);
    }

    // Upload dokumen awal
    const { dokumenDiterima, dokumenMentor, dokumenPimpinan } =
      this.fileService.uploadPKLDokumenAwal(pkl.id, {
        dokumenDiterima: files.dokumenDiterima,
        dokumenMentor: files.dokumenMentor,
        dokumenPimpinan: files.dokumenPimpinan,
      });

    try {
      // Update PKL with new data if available
      const updated = await this.PKLRepository.findOneAndUpdate(
        { _id: pkl.id },
        {
          namaInstansi: data.namaInstansi ?? pkl.namaInstansi,
          alamatInstansi: data.alamatInstansi ?? pkl.alamatInstansi,
          tanggalMulai: data.tanggalMulai
            ? new Date(data.tanggalMulai)
            : pkl.tanggalMulai,
          tanggalSelesai: data.tanggalSelesai
            ? new Date(data.tanggalSelesai)
            : pkl.tanggalSelesai,
          dokumenDiterima: dokumenDiterima ?? pkl.dokumenDiterima,
          dokumenMentor: dokumenMentor ?? pkl.dokumenMentor,
          dokumenPimpinan: dokumenPimpinan ?? pkl.dokumenPimpinan,
          status: EPKLStatus.MENUNGGU_PERSETUJUAN,
        },
      );

      // Create PKL timeline
      await this.PKLTimelineRepository.create({
        pklId: pkl.id,
        userId: pklCreateData.mahasiswa.userId as any,
        deskripsi: 'PKL diajukan ulang',
        status: EPKLStatus.MENUNGGU_PERSETUJUAN,
      });

      return updated;
    } catch (error) {
      // Rollback if failed to update PKL
      console.error(error);

      // Rollback updated PKL
      await this.PKLRepository.updateOne({ _id: pkl.id }, pkl.toObject());

      // Delete uploaded files
      this.fileService.deleteFiles(this.fileService.PKL_FOLDER_NAME, [
        dokumenDiterima?.split('/')?.pop(),
        dokumenMentor?.split('/')?.pop(),
        dokumenPimpinan?.split('/')?.pop(),
      ]);

      throw new InternalServerError(
        PKLMessage.FAIL_UPDATE_GENERIC,
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
  async getPKLDetail(pklId: string) {
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
   * Update PKL status by PKL id
   *
   * @param {string} pklId PKL id
   * @param {PKLUpdateStatusDTO} data PKL status data
   *
   * @throws {BadRequest} Status transition is incorrect
   * @throws {Forbidden} User is not Dosen or Admin
   */
  async updatePKLStatus(pklId: string, data: PKLUpdateStatusDTO) {
    const { id, dosenId, type } = this.req.user!;

    // Throw Forbidden if user is not Dosen or Admin
    if (type !== 'Admin' && type !== 'Dosen') {
      throw new Forbidden(PKLMessage.FAIL_UPDATE_PKL_STATUS_NOT_DOSEN);
    }

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      dosenId,
    });

    // Validate status transition
    if (
      // This should come from mahasiswa, not dosen
      data.status === EPKLStatus.MENUNGGU_PERSETUJUAN ||
      data.status === EPKLStatus.MULAI_FINALISASI ||
      // Initial Stage
      (pkl.status === EPKLStatus.MENUNGGU_PERSETUJUAN &&
        data.status !== EPKLStatus.PENGAJUAN_DITOLAK &&
        data.status !== EPKLStatus.MENUNGGU_VERIFIKASI) ||
      // Execution Stage
      (pkl.status === EPKLStatus.MENUNGGU_VERIFIKASI &&
        data.status !== EPKLStatus.VERIFIKASI_GAGAL &&
        data.status !== EPKLStatus.DITOLAK &&
        data.status !== EPKLStatus.GAGAL &&
        data.status !== EPKLStatus.DITERIMA) ||
      // Final Stage
      ((pkl.status === EPKLStatus.MULAI_FINALISASI ||
        pkl.status === EPKLStatus.PROSES_FINALISASI) &&
        data.status !== EPKLStatus.FINALISASI_DITOLAK &&
        data.status !== EPKLStatus.GAGAL &&
        data.status !== EPKLStatus.SELESAI)
    ) {
      throw new BadRequest(
        PKLMessage.FAIL_UPDATE_PKL_STATUS_INCORRECT_TRANSITION,
      );
    }

    const updateData: UpdateQuery<IPKL> = {
      status: data.status,
    };

    // Handle specific status
    if (data.status === EPKLStatus.DITERIMA) {
      updateData.approvedAt = new Date();
    } else if (data.status === EPKLStatus.DITOLAK) {
      const mhs = await this.mahasiswaRepository.getOneOrFail(pkl.mahasiswaId);
      updateData.rejectedAt = new Date();
      updateData.rejectedAtSemester = mhs.semester;
    } else if (data.status === EPKLStatus.SELESAI) {
      updateData.finishedAt = new Date();
    }

    // Update PKL status
    await this.PKLRepository.updateOne({ _id: pkl._id }, updateData);

    // Create PKL Timeline
    await this.PKLTimelineRepository.create({
      pklId: pkl._id,
      userId: id as any,
      deskripsi: data.deskripsi,
      status: data.status,
    });
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
  async listPKLTimeline(pklId: string) {
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
