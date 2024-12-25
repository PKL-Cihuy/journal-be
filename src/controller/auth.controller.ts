import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LoginDTO } from '@/dto/auth.dto';
import { AuthMessage } from '@/message';
import { AuthService } from '@/service';
import {
  Success,
  Unauthorized,
  errorResponse,
  sendResponse,
} from '@/util/response.util';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  async login(@Res() res: Response, @Body() body: LoginDTO) {
    try {
      const credentials = await this.service.login(body);

      const { rft, ...data } = credentials;

      res.cookie('rft', rft, { httpOnly: true });

      return sendResponse(res, new Success(AuthMessage.LOGIN_SUCCESS, data));
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  @Get('/token')
  @ApiOperation({ summary: 'Get short-lived access token' })
  async getAccessToken(@Res() res: Response, @Req() req: Request) {
    try {
      const cookie = req.cookies;

      if (!cookie?.rft) throw new Unauthorized(AuthMessage.NO_TOKEN_PROVIDED);

      const accessToken = await this.service.getAccessToken(cookie.rft);

      return sendResponse(
        res,
        new Success(AuthMessage.ACCESS_TOKEN_SUCCESS, accessToken),
      );
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }
}
