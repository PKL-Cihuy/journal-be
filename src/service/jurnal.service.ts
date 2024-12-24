import { Injectable, Scope } from '@nestjs/common';

import { PKLListQueryDTO } from '@/dto/pkl';
import { journalListPipeline } from '@/pipeline/journal';
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
   * @param {PKLListQueryDTO} query Query to filter journal data
   *
   * @returns List of journal data
   */
  async listJournal(pklId: string, query: PKLListQueryDTO) {
    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

    // List all populated PKL data or by filter
    const data = await this.JournalRepository.aggregate(
      journalListPipeline(pkl._id, query),
    );

    // Return formatted pagination response
    return formatPaginationResponse(data);
  }
}
