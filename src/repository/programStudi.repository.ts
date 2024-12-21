import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IProgramStudi } from '@/db/interface';
import { ProgramStudi } from '@/db/schema';

import { BaseRepository } from './base.repository';

@Injectable()
export class ProgramStudiRepository extends BaseRepository<IProgramStudi> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Program Studi tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE =
    'Satu atau lebih Program Studi tidak ditemukan';

  constructor(@InjectModel(ProgramStudi.name) model: Model<IProgramStudi>) {
    super(model);
  }
}
