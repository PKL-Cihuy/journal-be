import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { LoginDTO } from '@/dto/auth.dto';
import { PKLRepository, UserRepository } from '@/repository';
import { TokenRepository } from '@/repository/token.repository';
import { TokenPayload } from '@/repository/user.repository';
import { BadRequest } from '@/util/response.util';

@Injectable()
export class AuthService {
  protected INVALID_CREDENTIALS = 'Email atau Password salah';
  private ACCESS_TOKEN_TTL = '15m';
  private REFRESH_TOKEN_TTL = '24h';

  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
    private pklService: PKLRepository,
  ) {}

  public async login(cred: LoginDTO) {
    const user = await this.userRepo.getCredentials(cred.email);

    const passwordIsValid = await bcrypt.compare(cred.password, user.password);

    if (!passwordIsValid) throw new BadRequest(this.INVALID_CREDENTIALS);

    const tokenPayload: TokenPayload = await this.userRepo.getTokenPayload(
      user._id,
    );

    const { accessToken, refreshToken } = this.generateTokens(tokenPayload);

    const statusPKL = await this.pklService.getStatus(tokenPayload.mhsId!);

    await this.tokenRepo.saveToken(user._id, refreshToken);

    return {
      jwt: accessToken,
      user: {
        statusPKL,
        fullName: user.namaLengkap,
        type: user.type,
      },
    };
  }

  private generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_KEY!, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_KEY!, {
      expiresIn: this.REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }
}
