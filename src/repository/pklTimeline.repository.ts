import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPKLTimeline } from '@/db/interface';
import { PKLTimeline } from '@/db/schema';

import { BaseRepository } from './base.repository';

export class PKLTimelineRepository extends BaseRepository<IPKLTimeline> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'PKL Timeline tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE =
    'Satu atau lebih PKL Timeline tidak ditemukan';

  constructor(@InjectModel(PKLTimeline.name) model: Model<IPKLTimeline>) {
    super(model);
  }
}
