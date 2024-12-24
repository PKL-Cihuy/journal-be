import { Injectable, Scope } from '@nestjs/common';

import { JournalListQueryDTO } from '@/dto/journal';
import {
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
   */
  async listJournal(pklId: string, query: JournalListQueryDTO) {
    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

    // List all populated PKL data or by filter
    const data = await this.JournalRepository.aggregate(
      journalListPipeline(pkl._id, query),
    );

    // Return formatted pagination response
    return formatPaginationResponse(data);
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
   */
  async listJournalTimeline(pklId: string, journalId: string) {
    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

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
