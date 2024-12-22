import { Injectable, Scope } from '@nestjs/common';

import { PKLListQueryDTO } from '@/dto/pkl/pklList.dto';
import { PKLListPipeline } from '@/pipeline/pkl/pklList.pipeline';
import { PKLRepository } from '@/repository';
import { formatPaginationResponse } from '@/util/formatResponse.util';

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
    const data = await this.PKLRepository.aggregate(PKLListPipeline(query));

    return formatPaginationResponse(data);
  }
}
