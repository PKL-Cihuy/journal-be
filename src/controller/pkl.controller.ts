import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApiResponseList,
  ApiResponseOk,
  ApiResponsePaginated,
} from '@/decorator/response.decorator';
import { JournalListQueryDTO, JournalListResponseDTO } from '@/dto/journal';
import {
  PKLDetailResponseDTO,
  PKLListQueryDTO,
  PKLListResponseDTO,
  PKLTimelineListResponseDTO,
} from '@/dto/pkl';
import { JournalMessage, PKLMessage } from '@/message';
import { IsValidObjectIdPipe } from '@/pipe/isValidMongoId.pipe';
import { ParseQueryPipe } from '@/pipe/parseQuery.pipe';
import { JournalService, PKLService } from '@/service';
import { Success, errorResponse, sendResponse } from '@/util/response.util';

@Controller('/pkl')
@ApiTags('PKL')
@ApiBearerAuth('access-token')
export class PKLController {
  constructor(
    private readonly PKLService: PKLService,
    private readonly JournalService: JournalService,
  ) {}

  @Get('/')
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

  @Get('/:pklId')
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

  @Get('/:pklId/jurnal')
  @ApiResponsePaginated(JournalListResponseDTO, {
    message: JournalMessage.LIST_SUCCESS,
  })
  async listJurnal(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Query(new ParseQueryPipe(JournalListQueryDTO)) query: JournalListQueryDTO,
  ) {
    try {
      const data = await this.JournalService.listJournal(pklId, query);

      return sendResponse(
        response,
        new Success(JournalMessage.LIST_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
