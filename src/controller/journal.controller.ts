import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApiResponseCreated,
  ApiResponseList,
  ApiResponseOk,
  ApiResponsePaginated,
} from '@/decorator/response.decorator';
import {
  JournalCreateDTO,
  JournalCreateFilesDTO,
  JournalCreateResponseDTO,
  JournalDetailResponseDTO,
  JournalListQueryDTO,
  JournalListResponseDTO,
  JournalTimelineListResponseDTO,
  JournalUpdateDTO,
  JournalUpdateFilesDTO,
  JournalUpdateResponseDTO,
} from '@/dto/journal';
import { JournalMessage } from '@/message';
import { IsValidObjectIdPipe } from '@/pipe/isValidMongoId.pipe';
import { ParseFilesPipe } from '@/pipe/parseFiles.pipe';
import { ParseQueryPipe } from '@/pipe/parseQuery.pipe';
import { JournalService } from '@/service';
import {
  Created,
  Success,
  errorResponse,
  sendResponse,
} from '@/util/response.util';

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

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 5 }]),
  )
  @ApiOperation({ summary: 'Create Journal' })
  @ApiConsumes('multipart/form-data')
  @ApiResponseCreated({
    responseDTO: JournalCreateResponseDTO,
    message: JournalMessage.SUCCESS_LIST,
  })
  async createJournal(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Body() body: JournalCreateDTO,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(png|jpg|jpef|pdf|)/,
          })
          .addMaxSizeValidator({
            // Size: 10 MiB
            maxSize: 1024 * 1024 * 5,
          })
          .build(),
      ),
    )
    files: JournalCreateFilesDTO,
  ) {
    try {
      const data = await this.JournalService.createJournal(pklId, body, files);

      return sendResponse(
        response,
        new Created(JournalMessage.SUCCESS_CREATE, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:journalId')
  @ApiOperation({ summary: 'Get Journal Detail' })
  @ApiResponseOk({
    responseDTO: JournalDetailResponseDTO,
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

  @Put('/:journalId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 5 }]),
  )
  @ApiOperation({ summary: 'Update Journal' })
  @ApiConsumes('multipart/form-data')
  @ApiResponseCreated({
    responseDTO: JournalUpdateResponseDTO,
    message: JournalMessage.SUCCESS_UPDATE,
  })
  async updateJournal(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Param('journalId', IsValidObjectIdPipe) journalId: string,
    @Body() body: JournalUpdateDTO,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(png|jpg|jpef|pdf|)/,
          })
          .addMaxSizeValidator({
            // Size: 10 MiB
            maxSize: 1024 * 1024 * 5,
          })
          .build({
            fileIsRequired: false,
          }),
      ),
    )
    files: JournalUpdateFilesDTO,
  ) {
    try {
      const data = await this.JournalService.updateJournal(
        pklId,
        journalId,
        body,
        files,
      );

      return sendResponse(
        response,
        new Created(JournalMessage.SUCCESS_UPDATE, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:journalId/timeline')
  @ApiOperation({ summary: 'Get Journal Timeline' })
  @ApiResponseList(JournalTimelineListResponseDTO, {
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
