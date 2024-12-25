import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

import { IToken } from '@/db/interface/token.interface';
import { Token } from '@/db/schema/token.schema';
import { Forbidden } from '@/util/response.util';

import { BaseRepository } from './base.repository';

@Injectable()
export class TokenRepository extends BaseRepository<IToken> {
  protected TOKEN_NOT_FOUND = 'Token tidak ditemukan';
  protected TOKEN_INVALID = 'Token sudah tidak valid';

  constructor(@InjectModel(Token.name) model: Model<IToken>) {
    super(model);
  }

  public async checkToken(userId: string, token: string) {
    const t = await this.findOne({ userId, token }, { token: 1 });

    if (!t) throw new Forbidden(this.TOKEN_NOT_FOUND);

    jwt.verify(t.token, process.env.JWT_SECRET!, (err: jwt.VerifyErrors) => {
      if (err) throw new Forbidden(this.TOKEN_INVALID);
    });
  }

  public async saveToken(userId: string | Types.ObjectId, token: string) {
    await this.create({ userId, token });
  }
}
