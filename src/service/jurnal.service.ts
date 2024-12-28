import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Types } from 'mongoose';

import { EJournalStatus } from '@/db/interface';
import {
  JournalCreateDTO,
  JournalCreateFilesDTO,
  JournalListQueryDTO,
  JournalUpdateDTO,
  JournalUpdateFilesDTO,
} from '@/dto/journal';
import { JournalMessage } from '@/message';
import {
  journalDetailPipeline,
  journalListPipeline,
  journalTimelineListPipeline,
} from '@/pipeline/journal';
import {
  JournalRepository,
  JournalTimelineRepository,
  PKLRepository,
} from '@/repository';
import { formatPaginationResponse } from '@/util/formatResponse.util';
import {
  BadRequest,
  Forbidden,
  InternalServerError,
} from '@/util/response.util';

import { FileService } from './file.service';

@Injectable({ scope: Scope.REQUEST })
export class JournalService {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,
    private readonly PKLRepository: PKLRepository,
    private readonly journalRepository: JournalRepository,
    private readonly journalTimelineRepository: JournalTimelineRepository,

    private readonly fileService: FileService,
  ) {}

  /**
   * List Jurnal by pklId and filter by query
   *
   * @param {JournalListQueryDTO} query Query to filter journal data
   *
   * @returns List of journal data
   *
   * @throws {NotFound} User does not have access to PKL with id {pklId}
   */
  async listJournal(pklId: string, query: JournalListQueryDTO) {
    const { mhsId, dosenId } = this.req.user!;

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
      dosenId,
    });

    // List all populated PKL data or by filter
    const data = await this.journalRepository.aggregate(
      journalListPipeline(pkl._id, query),
    );

    // Return formatted pagination response
    return formatPaginationResponse(data);
  }

  /**
   * Create a new Jurnal
   *
   * @param {string} pklId PKL id
   * @param {JournalCreateDTO} data Journal data
   * @param {JournalCreateFilesDTO} files Journal attachments
   *
   * @returns Created Journal data
   *
   * @throws {Forbidden} User not Mahasiswa
   * @throws {InternalServerError} Failed to create Journal
   */
  async createJournal(
    pklId: string,
    data: JournalCreateDTO,
    files: JournalCreateFilesDTO,
  ) {
    const { id, mhsId } = this.req.user!;

    // Throw Forbidden if user is not Mahasiswa
    if (!mhsId) {
      throw new Forbidden(JournalMessage.FAIL_CREATE_JOURNAL_NOT_MAHASISWA);
    }

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
    });

    const newJurnalId = new Types.ObjectId();

    // Upload attachments
    const attachments = this.fileService.uploadJournalAttachments(
      String(newJurnalId),
      files.attachments,
    );

    try {
      // Create Journal
      const journal = await this.journalRepository.create({
        _id: newJurnalId,
        pklId: pkl.id,
        konten: data.konten,
        attachments: attachments,
        status: EJournalStatus.DIPROSES,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
      });

      // Create Journal Timeline
      await this.journalTimelineRepository.create({
        journalId: journal.id,
        userId: id as any,
        deskripsi: 'Jurnal dibuat',
        status: EJournalStatus.DIPROSES,
      });

      return journal;
    } catch (error) {
      console.error(error);

      // Rollback if failed to fully create Journal
      await this.journalRepository.deleteOne({ _id: newJurnalId });

      // Delete attachments if failed to create Journal
      this.fileService.deleteFiles(
        this.fileService.JURNAL_FOLDER_NAME,
        attachments.map((a) => a.split('/').pop()),
      );

      throw new InternalServerError(
        JournalMessage.FAIL_CREATE_GENERIC,
        error.message,
      );
    }
  }

  /**
   * Update Jurnal
   *
   * @param {string} pklId PKL id
   * @param {string} journalId Journal id
   * @param {JournalUpdateDTO} data Journal data
   * @param {JournalUpdateFilesDTO} files Journal attachments
   *
   * @returns Updated Journal data
   *
   * @throws {Forbidden} User not Mahasiswa
   * @throws {BadRequest} Journal status is not 'Ditolak'
   * @throws {InternalServerError} Failed to update Journal
   */
  async updateJournal(
    pklId: string,
    journalId: string,
    data: JournalUpdateDTO,
    files: JournalUpdateFilesDTO,
  ) {
    const { id, mhsId } = this.req.user!;

    // Throw Forbidden if user is not Mahasiswa
    if (!mhsId) {
      throw new Forbidden(JournalMessage.FAIL_UPDATE_JOURNAL_NOT_MAHASISWA);
    }

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
    });

    // Check if Journal exist
    const journal = await this.journalRepository.getOneOrFail({
      _id: journalId,
      pklId: pkl.id,
    });

    // Throw BadRequest if Journal status is not 'Ditolak'
    if (journal.status !== EJournalStatus.DITOLAK) {
      throw new BadRequest(JournalMessage.FAIL_UPDATE_JOURNAL_INCORRECT_STATUS);
    }

    // Upload attachments
    const attachments = this.fileService.uploadJournalAttachments(
      journal.id,
      files.attachments,
    );

    try {
      // Update Journal with ne data if available
      const updated = await this.journalRepository.findOneAndUpdate(
        { _id: journal.id },
        {
          konten: data.konten,
          attachments:
            attachments.length > 0 ? attachments : journal.attachments,
          status: EJournalStatus.DIPROSES,
          tanggalMulai: data.tanggalMulai
            ? new Date(data.tanggalMulai)
            : journal.tanggalMulai,
          tanggalSelesai: data.tanggalSelesai
            ? new Date(data.tanggalSelesai)
            : journal.tanggalSelesai,
        },
      );

      // Create Journal Timeline
      await this.journalTimelineRepository.create({
        journalId: journal.id,
        userId: id as any,
        deskripsi: 'Jurnal diperbarui',
        status: EJournalStatus.DIPROSES,
      });

      return updated;
    } catch (error) {
      console.error(error);

      // Rollback if failed to fully create Journal
      await this.journalRepository.updateOne(
        { _id: journal.id },
        journal.toObject(),
      );

      // Delete attachments if failed to update Journal
      this.fileService.deleteFiles(
        this.fileService.JURNAL_FOLDER_NAME,
        attachments.map((a) => a.split('/').pop()),
      );

      throw new InternalServerError(
        JournalMessage.FAIL_UPDATE_GENERIC,
        error.message,
      );
    }
  }

  /**
   * Get Jurnal detail
   *
   * @param {string} pklId Used to check if PKL exist
   * @param {string} journalId Used to check if Journal exist
   *
   * @returns Journal data
   *
   * @throws {NotFound} PKL with id {pklId} not found
   * @throws {NotFound} Journal with id {journalId} not found
   * @throws {NotFound} User does not have access to PKL with id {pklId}
   */
  async getJournalDetail(pklId: string, journalId: string) {
    const { mhsId, dosenId } = this.req.user!;

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
      dosenId,
    });

    // Check if Journal exist
    const journal = await this.journalRepository.getOneOrFail({
      _id: journalId,
      pklId: pkl.id,
    });

    // Get Journal data
    const data = await this.journalRepository.aggregate(
      journalDetailPipeline(journal._id),
    );

    // Return first data since aggregation always return array
    return data[0];
  }

  /**
   * List Jurnal timeline by journalId
   *
   * @param {string} pklId Used to check if PKL exist
   * @param {string} journalId Used to check if Journal exist
   *
   * @returns List of journal timeline data
   *
   * @throws {NotFound} PKL with id {pklId} not found
   * @throws {NotFound} Journal with id {journalId} not found
   * @throws {NotFound} User does not have access to PKL with id {pklId}
   */
  async listJournalTimeline(pklId: string, journalId: string) {
    const { mhsId, dosenId } = this.req.user!;

    // Check if PKL exist
    const pkl = await this.PKLRepository.getPKLByUserType(pklId, {
      mhsId,
      dosenId,
    });

    // Check if Journal exist
    const journal = await this.journalRepository.getOneOrFail({
      _id: journalId,
      pklId: pkl.id,
    });

    // Get populated Journal timeline data
    const timeline = await this.journalTimelineRepository.aggregate(
      journalTimelineListPipeline(journal._id),
    );

    // Return formatted pagination response
    return timeline;
  }
}
