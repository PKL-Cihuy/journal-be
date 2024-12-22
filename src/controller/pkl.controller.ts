import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiResponseOk } from '@/decorator/response.decorator';
import { PKLListQueryDTO, PKLListResponseDTO } from '@/dto/pkl/pklList.dto';
import { PKLMessage } from '@/message/pkl.message';
import { ListQueryPipe } from '@/pipe/listQuery.pipe';
import { PKLService } from '@/service';
import { Success, errorResponse, sendResponse } from '@/util/response.util';

@Controller('/pkl')
@ApiTags('PKL')
@ApiBearerAuth('access-token')
export class PKLController {
  constructor(private readonly PKLService: PKLService) {}

  @Get('/')
  @ApiResponseOk({
    responseDTO: PKLListResponseDTO,
    message: PKLMessage.LIST_SUCCESS,
  })
  async listPKL(
    @Res() response: Response,
    @Query(new ListQueryPipe(PKLListQueryDTO)) query: PKLListQueryDTO,
  ) {
    try {
      const data = await this.PKLService.listPKL(query);

      return sendResponse(response, new Success(PKLMessage.LIST_SUCCESS, data));
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
