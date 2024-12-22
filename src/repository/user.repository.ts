import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IUser } from '@/db/interface';
import { User } from '@/db/schema';
import { getTokenPayloadPipeline } from '@/pipeline/user/getTokenPayload.pipeline';
import { NotFound } from '@/util/response.util';

import { BaseRepository } from './base.repository';

export interface TokenPayload {
  id?: string;
  type?: 'Mahasiwa' | 'Dosen' | 'Admin';
  mhsId?: string | null;
  dosenId?: string | null;
}

@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'User tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih User tidak ditemukan';

  constructor(@InjectModel(User.name) model: Model<IUser>) {
    super(model);
  }

  public async getCredentials(email: string) {
    const user = await this.findOne(
      { email },
      { _id: 1, email: 1, password: 1, type: 1, namaLengkap: 1 },
    );

    if (!user) throw new NotFound(this.GET_ONE_OR_FAIL_MESSAGE);

    return user;
  }

  public async getTokenPayload(_id: Types.ObjectId): Promise<TokenPayload> {
    const pipeline = getTokenPayloadPipeline(_id);
    const [payload] = await this.aggregate(pipeline);

    return payload as TokenPayload;
  }
}
