import { Body, Controller, Post } from '@nestjs/common';

import { LoginDTO } from '@/dto/auth.dto';
import {
  MahasiswaRepository,
  PKLRepository,
  UserRepository,
} from '@/repository';
import { AuthService } from '@/service/auth.service';

@Controller('/users/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly userRepo: UserRepository,
    private readonly mhsRepo: MahasiswaRepository,
    private readonly pklRepo: PKLRepository,
  ) {}

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    const credentials = await this.service.login(body);

    return credentials;
  }
}
