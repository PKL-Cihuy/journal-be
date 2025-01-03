import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiIAmATeapotResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiResponseOk, GenericResponse } from '@/decorator/response.decorator';
import { AppMessage } from '@/message';
import { Success, Teapot, sendResponse } from '@/util/response.util';

@Controller('/')
@ApiTags('Root')
export class AppController {
  constructor() {}

  @Get('/')
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponseOk({ message: AppMessage.HELLO_WORLD })
  helloWorld(@Res() response: Response) {
    return sendResponse(response, new Success(AppMessage.HELLO_WORLD));
  }

  @Get('/ping')
  @ApiOperation({ summary: 'Pong!' })
  @ApiResponseOk({ message: AppMessage.PONG })
  pong(@Res() response: Response) {
    return sendResponse(response, new Success(AppMessage.PONG));
  }

  @Get('/teapot')
  @ApiOperation({ summary: 'I am a teapot!' })
  @GenericResponse(
    {
      _ApiResponseClass: ApiIAmATeapotResponse,
      status: HttpStatus.I_AM_A_TEAPOT,
    },
    { message: AppMessage.I_AM_A_TEAPOT },
  )
  teapot() {
    throw new Teapot(AppMessage.I_AM_A_TEAPOT);
  }
}
