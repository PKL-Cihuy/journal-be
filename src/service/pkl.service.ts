import { Injectable, Scope } from '@nestjs/common';

import { PKLListQueryDTO } from '@/dto/pkl';
import {
  PKLGetDetailPipeline,
  PKLListPipeline,
  PKLTimelineListPipeline,
} from '@/pipeline/pkl';
import { PKLRepository, PKLTimelineRepository } from '@/repository';
import { formatPaginationResponse } from '@/util/formatResponse.util';

import { FileService } from './file.service';

@Injectable({ scope: Scope.REQUEST })
export class PKLService {
  constructor(
    private readonly PKLRepository: PKLRepository,
    private readonly PKLTimelineRepository: PKLTimelineRepository,

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
    // TODO: Filter by user type

    // List all populated PKL data or by filter
    const data = await this.PKLRepository.aggregate(PKLListPipeline(query));

    // Return formatted pagination response
    return formatPaginationResponse(data);
  }

  /**
   * Get PKL detail by PKL id
   *
   * @param {string} pklId PKL id
   *
   * @returns Populated PKL data
   *
   * @throws {NotFound} PKL with id {pklId} not found
   */
  async getPKLDetail(pklId: string) {
    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

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
   */
  async listPKLTimeline(pklId: string) {
    // Check if PKL exist
    const pkl = await this.PKLRepository.getOneOrFail(pklId);

    // Get populated PKL timeline data
    const timeline = await this.PKLTimelineRepository.aggregate(
      PKLTimelineListPipeline(pkl._id),
    );

    // Return timeline data
    return timeline;
  }
}
