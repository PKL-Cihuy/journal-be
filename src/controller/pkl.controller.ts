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
  ApiResponseBadRequest,
  ApiResponseCreated,
  ApiResponseForbidden,
  ApiResponseInternalServerError,
  ApiResponseList,
  ApiResponseOk,
  ApiResponsePaginated,
} from '@/decorator/response.decorator';
import {
  PKLCreateDTO,
  PKLCreateFilesDTO,
  PKLCreateResponseDTO,
  PKLDetailResponseDTO,
  PKLGetCreateDataResponseDTO,
  PKLListQueryDTO,
  PKLListResponseDTO,
  PKLTimelineListResponseDTO,
} from '@/dto/pkl';
import {
  PKLUpdateDTO,
  PKLUpdateFilesDTO,
  PKLUpdateResponseDTO,
} from '@/dto/pkl/pklUpdate.dto';
import { PKLMessage } from '@/message';
import { IsValidObjectIdPipe } from '@/pipe/isValidMongoId.pipe';
import { ParseFilesPipe } from '@/pipe/parseFiles.pipe';
import { ParseQueryPipe } from '@/pipe/parseQuery.pipe';
import { ParseSingleFilePositionPipe } from '@/pipe/parseSingleFilePosition.pipe';
import { PKLService } from '@/service';
import {
  Created,
  Success,
  errorResponse,
  sendResponse,
} from '@/util/response.util';

@Controller('/pkl')
@ApiTags('PKL')
@ApiBearerAuth('access-token')
export class PKLController {
  constructor(private readonly PKLService: PKLService) {}

  @Get('/')
  @ApiOperation({ summary: 'List PKL' })
  @ApiResponsePaginated(PKLListResponseDTO, {
    message: PKLMessage.SUCCESS_LIST,
  })
  async listPKL(
    @Res() response: Response,
    @Query(new ParseQueryPipe(PKLListQueryDTO)) query: PKLListQueryDTO,
  ) {
    try {
      const data = await this.PKLService.listPKL(query);

      return sendResponse(response, new Success(PKLMessage.SUCCESS_LIST, data));
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/create')
  @ApiOperation({ summary: 'Get data for creating PKL (intended for UI data)' })
  @ApiResponseOk({
    responseDTO: PKLGetCreateDataResponseDTO,
    message: PKLMessage.SUCCESS_GET_CREATE_DATA,
  })
  @ApiResponseForbidden({
    message: PKLMessage.FAIL_CREATE_PKL_NOT_MAHASISWA,
  })
  async getCreateData(@Res() response: Response) {
    try {
      const data = await this.PKLService.getCreateData();

      return sendResponse(
        response,
        new Success(PKLMessage.SUCCESS_GET_CREATE_DATA, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'dokumenDiterima', maxCount: 1 },
      { name: 'dokumenMentor', maxCount: 1 },
      { name: 'dokumenPimpinan', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Submit a new PKL for approval' })
  @ApiConsumes('multipart/form-data')
  @ApiResponseCreated({
    responseDTO: PKLCreateResponseDTO,
    message: PKLMessage.SUCCESS_CREATE,
  })
  @ApiResponseForbidden({
    message: PKLMessage.FAIL_CREATE_PKL_NOT_MAHASISWA,
  })
  @ApiResponseInternalServerError({
    message: PKLMessage.FAIL_CREATE_GENERIC,
  })
  async createPKL(
    @Res() response: Response,
    @Body()
    body: PKLCreateDTO,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(pdf)/,
          })
          .addMaxSizeValidator({
            // Size: 10 MiB
            maxSize: 1024 * 1024 * 5,
          })
          .build(),
      ),
      new ParseSingleFilePositionPipe([
        'dokumenDiterima',
        'dokumenMentor',
        'dokumenPimpinan',
      ]),
    )
    files: PKLCreateFilesDTO,
  ) {
    try {
      const data = await this.PKLService.createPKL(body, files);

      return sendResponse(
        response,
        new Created(PKLMessage.SUCCESS_CREATE, data),
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
    message: PKLMessage.SUCCESS_DETAIL,
  })
  async getPKLDetail(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
  ) {
    try {
      const data = await this.PKLService.getPKLDetail(pklId);

      return sendResponse(
        response,
        new Success(PKLMessage.SUCCESS_DETAIL, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Put('/:pklId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'dokumenDiterima', maxCount: 1 },
      { name: 'dokumenMentor', maxCount: 1 },
      { name: 'dokumenPimpinan', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Resubmit PKL (due to rejection) for approval' })
  @ApiConsumes('multipart/form-data')
  @ApiResponseCreated({
    responseDTO: PKLUpdateResponseDTO,
    message: PKLMessage.SUCCESS_UPDATE,
  })
  @ApiResponseBadRequest({
    message: PKLMessage.FAIL_PKL_UPDATE_INCORRECT_STATUS,
  })
  @ApiResponseForbidden({
    message: PKLMessage.FAIL_CREATE_PKL_NOT_MAHASISWA,
  })
  @ApiResponseInternalServerError({
    message: PKLMessage.FAIL_CREATE_GENERIC,
  })
  async updatePKL(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
    @Body()
    body: PKLUpdateDTO,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(pdf)/,
          })
          .addMaxSizeValidator({
            // Size: 5 MiB
            maxSize: 1024 * 1024 * 5,
          })
          .build({
            // Allow empty files for resubmission
            fileIsRequired: false,
          }),
      ),
      new ParseSingleFilePositionPipe([
        'dokumenDiterima',
        'dokumenMentor',
        'dokumenPimpinan',
      ]),
    )
    files: PKLUpdateFilesDTO,
  ) {
    try {
      const data = await this.PKLService.updatePKL(pklId, body, files);

      return sendResponse(
        response,
        new Created(PKLMessage.SUCCESS_UPDATE, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/:pklId/timeline')
  @ApiOperation({ summary: 'List PKL Timeline' })
  @ApiResponseList(PKLTimelineListResponseDTO, {
    message: PKLMessage.SUCCESS_TIMELINE,
  })
  async listPKLTimeline(
    @Res() response: Response,
    @Param('pklId', IsValidObjectIdPipe) pklId: string,
  ) {
    try {
      const data = await this.PKLService.listPKLTimeline(pklId);

      return sendResponse(
        response,
        new Success(PKLMessage.SUCCESS_TIMELINE, data),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
