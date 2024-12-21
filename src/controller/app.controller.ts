import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { Success, Teapot, sendResponse } from '@/util/response.util';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/')
  helloWorld(@Res() response: Response) {
    return sendResponse(response, new Success('Hello World!'));
  }

  @Get('/ping')
  pong(@Res() response: Response) {
    return sendResponse(response, new Success('Pong!'));
  }

  @Get('/teapot')
  teapot() {
    throw new Teapot('I am a teapot!');
  }
}
