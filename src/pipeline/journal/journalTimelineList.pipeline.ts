import { Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { IPKL, IUser } from '@/db/interface';

import { PipelineBuilder } from '../builder/pipeline.builder';

/**
 * Collection: JournalTimeline
 */
export function journalTimelineListPipeline(journalId: Types.ObjectId) {
  const pipelineBuilder = new PipelineBuilder<IPKL>()
    .match({ journalId: journalId })
    .lookup({
      from: DBCollection.USER,
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
      unwind: true,
      pipeline: new PipelineBuilder<IUser>()
        .project({ __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
        .build() as any,
    })
    .sort({ createdAt: -1 })
    .project({ __v: 0, pklId: 0, userId: 0, updatedAt: 0 });

  return pipelineBuilder.build();
}
