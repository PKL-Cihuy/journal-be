import { Injectable, Scope } from '@nestjs/common';

import { PKLListQueryDTO } from '@/dto/pkl/pklList.dto';
import { PKLGetDetailPipeline } from '@/pipeline/pkl/pklGetDetail.pipeline';
import { PKLListPipeline } from '@/pipeline/pkl/pklList.pipeline';
import { PKLRepository } from '@/repository';
import { formatPaginationResponse } from '@/util/formatResponse.util';
import { NotFound } from '@/util/response.util';

import { FileService } from './file.service';

@Injectable({ scope: Scope.REQUEST })
export class PKLService {
  constructor(
    private readonly PKLRepository: PKLRepository,

    private readonly fileService: FileService,
  ) {}

  /**
   * List PKL by query and user type
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
}
