import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IJournal } from '@/db/interface';
import { Journal } from '@/db/schema';

import { BaseRepository } from './base.repository';

@Injectable()
export class JournalRepository extends BaseRepository<IJournal> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Jurnal tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih Jurnal tidak ditemukan';

  constructor(@InjectModel(Journal.name) model: Model<IJournal>) {
    super(model);
  }
}
