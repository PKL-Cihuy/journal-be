import { Types } from 'mongoose';

import { IJournal } from '@/db/interface';

import { PipelineBuilder } from '../builder/pipeline.builder';

export function journalDetailPipeline(journalId: Types.ObjectId) {
  const pipelineBuilder = new PipelineBuilder<IJournal>()
    .match({ _id: journalId })
    .project({ __v: 0, pklId: 0 });

  return pipelineBuilder.build();
}
