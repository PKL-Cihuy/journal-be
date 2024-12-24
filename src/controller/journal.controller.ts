import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApiResponseList,
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
  @ApiResponsePaginated(JournalListResponseDTO, {
    message: JournalMessage.LIST_SUCCESS,
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
        new Success(JournalMessage.LIST_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:journalId/timeline')
  @ApiResponseList(JournalListResponseDTO, {
    message: JournalMessage.TIMELINE_SUCCESS,
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
        new Success(JournalMessage.TIMELINE_SUCCESS, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
