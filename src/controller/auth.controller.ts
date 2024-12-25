import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { LoginDTO } from '@/dto/auth.dto';
import { AuthService } from '@/service/auth.service';
import { Unauthorized } from '@/util/response.util';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const credentials = await this.service.login(body);

    const { rft, ...data } = credentials;

    res.cookie('rft', rft, { httpOnly: true });

    res.status(200).json(data);
  }

  @Get('/tokens')
  async getAccessToken(@Req() req: Request) {
    const cookie = req.cookies;

    if (!cookie || !cookie.rft) throw new Unauthorized('no token provided');

    const accessToken = await this.service.getAccessToken(cookie.rft);

    return { accessToken };
  }
}
