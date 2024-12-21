import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IFakultas } from '@/db/interface';
import { Fakultas } from '@/db/schema';

import { BaseRepository } from './base.repository';

export class FakultasRepository extends BaseRepository<IFakultas> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Fakultas tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih Fakultas tidak ditemukan';

  constructor(@InjectModel(Fakultas.name) model: Model<IFakultas>) {
    super(model);
  }
}
