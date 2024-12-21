import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IJournalTimeline } from '@/db/interface';
import { JournalTimeline } from '@/db/schema';

import { BaseRepository } from './base.repository';

@Injectable()
export class JournalTimelineRepository extends BaseRepository<IJournalTimeline> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Jurnal Timeline tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE =
    'Satu atau lebih Jurnal Timeline tidak ditemukan';

  constructor(
    @InjectModel(JournalTimeline.name) model: Model<IJournalTimeline>,
  ) {
    super(model);
  }
}
