import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

import { IToken } from '@/db/interface/token.interface';
import { Token } from '@/db/schema/token.schema';
import { Forbidden } from '@/util/response.util';

import { BaseRepository } from './base.repository';

@Injectable()
export class TokenRepository extends BaseRepository<IToken> {
  protected TOKEN_NOT_FOUND = 'Tidak ada token ditemukan';
  protected TOKEN_INVALID = 'Token Sudah Tidak Valid';

  constructor(@InjectModel(Token.name) model: Model<IToken>) {
    super(model);
  }

  public async checkToken(userId: string, token: string) {
    const t = await this.findOne({ userId, token }, { token: 1 });

    if (!t) throw new Forbidden(this.TOKEN_NOT_FOUND);

    try {
      jwt.verify(t.token, process.env.JWT_KEY!, (err) => {
        if (err) throw new Forbidden(this.TOKEN_INVALID);
      });
    } catch (error) {
      throw error;
    }
  }

  public async saveToken(userId: string | Types.ObjectId, token: string) {
    await this.create({ userId, token });
  }
}
