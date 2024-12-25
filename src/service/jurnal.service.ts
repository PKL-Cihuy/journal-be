import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { JournalListQueryDTO } from '@/dto/journal';
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

import { FileService } from './file.service';

@Injectable({ scope: Scope.REQUEST })
export class JournalService {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,
    private readonly PKLRepository: PKLRepository,
    private readonly JournalRepository: JournalRepository,
    private readonly JournalTimelineRepository: JournalTimelineRepository,

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
    const data = await this.JournalRepository.aggregate(
      journalListPipeline(pkl._id, query),
    );

    // Return formatted pagination response
    return formatPaginationResponse(data);
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
    const journal = await this.JournalRepository.getOneOrFail({
      _id: journalId,
      pklId: pkl._id,
    });

    // Get Journal data
    const data = await this.JournalRepository.aggregate(
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
    const journal = await this.JournalRepository.getOneOrFail({
      _id: journalId,
      pklId: pkl._id,
    });

    // Get populated Journal timeline data
    const timeline = await this.JournalTimelineRepository.aggregate(
      journalTimelineListPipeline(journal._id),
    );

    // Return formatted pagination response
    return timeline;
  }
}
