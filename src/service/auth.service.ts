import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { EUserType } from '@/db/interface';
import { LoginDTO } from '@/dto/auth.dto';
import {
  DosenRepository,
  MahasiswaRepository,
  PKLRepository,
  TokenRepository,
  UserRepository,
} from '@/repository';
import { BadRequest } from '@/util/response.util';

export interface TokenPayload {
  id?: Types.ObjectId;
  type?: EUserType;
  mhsId?: Types.ObjectId | null;
  dosenId?: Types.ObjectId | null;
}

@Injectable()
export class AuthService {
  protected INVALID_CREDENTIALS = 'Email atau Password salah';
  private readonly ACCESS_TOKEN_TTL = '15m';
  private readonly REFRESH_TOKEN_TTL = '24h';

  constructor(
    private readonly userRepo: UserRepository,
    private readonly dosenRepo: DosenRepository,
    private readonly mhsRepo: MahasiswaRepository,
    private readonly tokenRepo: TokenRepository,
    private readonly pklService: PKLRepository,
  ) {}

  public async login(cred: LoginDTO) {
    const user = await this.userRepo.getCredentials(cred.email);

    const passwordIsValid = await bcrypt.compare(cred.password, user.password);

    if (!passwordIsValid) throw new BadRequest(this.INVALID_CREDENTIALS);

    const tokenPayload: TokenPayload = await this.generateTokenPayload(
      user._id,
    );

    const { accessToken, refreshToken } = this.generateTokens(tokenPayload);

    const statusPKL = await this.pklService.findOne({
      mahasiswaId: tokenPayload.mhsId,
    });

    await this.tokenRepo.saveToken(user._id, refreshToken);

    return {
      rft: refreshToken,
      jwt: accessToken,
      user: {
        statusPKL: statusPKL?.status,
        fullName: user.namaLengkap,
        type: user.type,
      },
    };
  }

  private generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: this.REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }

  private async generateTokenPayload(
    userId: string | Types.ObjectId,
  ): Promise<TokenPayload> {
    const [user, dosen, mhs] = await Promise.all([
      this.userRepo.findOne({ _id: userId }),
      this.dosenRepo.findOne({ userId }),
      this.mhsRepo.findOne({ userId }),
    ]);

    return {
      id: userId as Types.ObjectId,
      type: user?.type,
      mhsId: mhs?._id,
      dosenId: dosen?._id,
    };
  }

  public async getAccessToken(rft: string) {
    const payload = jwt.decode(rft) as jwt.JwtPayload;

    await this.tokenRepo.checkToken(payload.id, rft);

    const newPayload = await this.generateTokenPayload(payload.id);

    return jwt.sign(newPayload, process.env.JWT_SECRET!, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });
  }
}
