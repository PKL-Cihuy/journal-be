import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApiResponseList,
  ApiResponseOk,
  ApiResponsePaginated,
} from '@/decorator/response.decorator';
import { JournalListQueryDTO, JournalListResponseDTO } from '@/dto/journal';
import { JournalMessage } from '@/message';
import { IsValidObjectIdPipe } from '@/pipe/isValidMongoId.pipe';
import { ParseQueryPipe } from '@/pipe/parseQuery.pipe';
import { JournalService } from '@/service';
import { Success, errorResponse, sendResponse } from '@/util/response.util';

@Controller('/pkl/:pklId/jurnal')
@ApiTags('Journal')
@ApiBearerAuth('access-token')
export class JournalController {
  constructor(private readonly JournalService: JournalService) {}

  @Get('/')
  @ApiOperation({ summary: 'List Journal' })
  @ApiResponsePaginated(JournalListResponseDTO, {
    message: JournalMessage.SUCCESS_LIST,
  })
  async listJournal(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Query(new ParseQueryPipe(JournalListQueryDTO)) query: JournalListQueryDTO,
  ) {
    try {
      const data = await this.JournalService.listJournal(pklId, query);

      return sendResponse(
        response,
        new Success(JournalMessage.SUCCESS_LIST, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:journalId')
  @ApiOperation({ summary: 'Get Journal Detail' })
  @ApiResponseOk({
    responseDTO: JournalListResponseDTO,
    message: JournalMessage.SUCCESS_DETAIL,
  })
  async getJournalDetail(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Param('journalId', IsValidObjectIdPipe) journalId: string,
  ) {
    try {
      const data = await this.JournalService.getJournalDetail(pklId, journalId);

      return sendResponse(
        response,
        new Success(JournalMessage.SUCCESS_DETAIL, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:journalId/timeline')
  @ApiOperation({ summary: 'Get Journal Timeline' })
  @ApiResponseList(JournalListResponseDTO, {
    message: JournalMessage.SUCCESS_TIMELINE,
  })
  async listJournalTimeline(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Param('journalId', IsValidObjectIdPipe) journalId: string,
  ) {
    try {
      const data = await this.JournalService.listJournalTimeline(
        pklId,
        journalId,
      );

      return sendResponse(
        response,
        new Success(JournalMessage.SUCCESS_TIMELINE, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
