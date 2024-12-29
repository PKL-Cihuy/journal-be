import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { FileServeService } from '@/service';
import { errorResponse } from '@/util/response.util';

@Controller('/files')
@ApiTags('Files')
@ApiBearerAuth('access-token')
export class FileController {
  constructor(private readonly fileServeService: FileServeService) {}

  @Get('/:type(pkl|jurnal)/:fileName')
  async test(
    @Res() res: Response,
    @Param('type') type: 'pkl' | 'jurnal',
    @Param('fileName') fileName: string,
  ) {
    try {
      const filePath = await this.fileServeService.serveFile(
        type.toLowerCase() as 'pkl' | 'jurnal',
        fileName,
      );
      console.log(filePath);

      return res.sendFile(filePath);
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
