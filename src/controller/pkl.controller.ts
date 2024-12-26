import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApiResponseForbidden,
  ApiResponseList,
  ApiResponseOk,
  ApiResponsePaginated,
} from '@/decorator/response.decorator';
import {
  PKLDetailResponseDTO,
  PKLGetCreateDataResponseDTO,
  PKLListQueryDTO,
  PKLListResponseDTO,
  PKLTimelineListResponseDTO,
} from '@/dto/pkl';
import { PKLMessage } from '@/message';
import { IsValidObjectIdPipe } from '@/pipe/isValidMongoId.pipe';
import { ParseQueryPipe } from '@/pipe/parseQuery.pipe';
import { PKLService } from '@/service';
import { Success, errorResponse, sendResponse } from '@/util/response.util';

@Controller('/pkl')
@ApiTags('PKL')
@ApiBearerAuth('access-token')
export class PKLController {
  constructor(private readonly PKLService: PKLService) {}

  @Get('/')
  @ApiOperation({ summary: 'List PKL' })
  @ApiResponsePaginated(PKLListResponseDTO, {
    message: PKLMessage.LIST_SUCCESS,
  })
  async listPKL(
    @Res() response: Response,
    @Query(new ParseQueryPipe(PKLListQueryDTO)) query: PKLListQueryDTO,
  ) {
    try {
      const data = await this.PKLService.listPKL(query);

      return sendResponse(response, new Success(PKLMessage.LIST_SUCCESS, data));
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/create')
  @ApiOperation({
    summary: 'Get data for creating PKL (intended for UI data)',
  })
  @ApiResponseOk({
    responseDTO: PKLGetCreateDataResponseDTO,
    message: PKLMessage.GET_CREATE_DATA_SUCCESS,
  })
  @ApiResponseForbidden({ message: PKLMessage.CREATE_PKL_NOT_MAHASISWA })
  async getCreateData(@Res() response: Response) {
    try {
      const data = await this.PKLService.getCreateData();

      return sendResponse(
        response,
        new Success(PKLMessage.GET_CREATE_DATA_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:pklId')
  @ApiOperation({ summary: 'Get PKL Detail' })
  @ApiResponseOk({
    responseDTO: PKLDetailResponseDTO,
    message: PKLMessage.DETAIL_SUCCESS,
  })
  async getPKLDetail(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
  ) {
    try {
      const data = await this.PKLService.getPKLDetail(pklId);

      return sendResponse(
        response,
        new Success(PKLMessage.DETAIL_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:pklId/timeline')
  @ApiOperation({ summary: 'List PKL Timeline' })
  @ApiResponseList(PKLTimelineListResponseDTO, {
    message: PKLMessage.TIMELINE_SUCCESS,
  })
  async listPKLTimeline(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
  ) {
    try {
      const data = await this.PKLService.listPKLTimeline(pklId);

      return sendResponse(
        response,
        new Success(PKLMessage.TIMELINE_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
