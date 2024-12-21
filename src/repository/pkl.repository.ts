import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPKL } from '@/db/interface';
import { PKL } from '@/db/schema';

import { BaseRepository } from './base.repository';

@Injectable()
export class PKLRepository extends BaseRepository<IPKL> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'PKL tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih PKL tidak ditemukan';

  constructor(@InjectModel(PKL.name) model: Model<IPKL>) {
    super(model);
  }
}
