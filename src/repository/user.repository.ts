import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from '@/db/interface';
import { User } from '@/db/schema';

import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<IUser> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'User tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih User tidak ditemukan';

  constructor(@InjectModel(User.name) model: Model<IUser>) {
    super(model);
  }
}
