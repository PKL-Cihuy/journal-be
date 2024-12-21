import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IDosen } from '@/db/interface';
import { Dosen } from '@/db/schema';

import { BaseRepository } from './base.repository';

export class DosenRepository extends BaseRepository<IDosen> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Dosen tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih Dosen tidak ditemukan';

  constructor(@InjectModel(Dosen.name) model: Model<IDosen>) {
    super(model);
  }
}
