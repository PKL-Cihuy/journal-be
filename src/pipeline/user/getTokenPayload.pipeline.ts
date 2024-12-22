import { Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';

import { PipelineBuilder } from '../builder/pipeline.builder';

export function getTokenPayloadPipeline(_id: Types.ObjectId) {
  return new PipelineBuilder()
    .match({ _id })
    .lookup({
      from: DBCollection.DOSEN,
      as: 'dosen',
      foreignField: 'userId',
      localField: '_id',
      pipeline: [{ $project: { userId: 1 } }],
    })
    .lookup({
      from: DBCollection.MAHASISWA,
      as: 'mahasiswa',
      foreignField: 'userId',
      localField: '_id',
      pipeline: [{ $project: { userId: 1 } }],
    })
    .lookup({
      from: DBCollection.PKL,
      as: 'pkl',
      foreignField: 'userId',
      localField: '_id',
      pipeline: [{ $project: { status: 1 } }],
    })
    .bulkUnwind(['$dosen', '$mahasiswa'])
    .project({
      _id: 1,
      type: 1,
      mhsId: '$mahasiswa.userId',
      dosenId: '$dosen.userId',
      statusPKL: '$pkl.status',
    })
    .build();
}
