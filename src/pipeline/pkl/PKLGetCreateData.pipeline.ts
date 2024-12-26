import { Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';

import { PipelineBuilder } from '../builder/pipeline.builder';

/**
 * Collection: Mahasiswa
 */
export function PKLGetCreateDataPipeline(mhsId: Types.ObjectId) {
  const pipelineBuilder = new PipelineBuilder()
    .match({ _id: mhsId })
    .getUserData({ keepUserId: true })
    .addFields({
      mahasiswa: {
        _id: '$_id',
        namaLengkap: '$namaLengkap',
        nim: '$nim',
        email: '$email',
        semester: '$semester',
        nomorHandphone: '$nomorHandphone',
      },
    })
    .lookup({
      from: DBCollection.FAKULTAS,
      localField: 'fakultasId',
      foreignField: '_id',
      as: 'fakultas',
      unwind: true,
      pipeline: new PipelineBuilder()
        .project({
          nama: 1,
          initial: 1,
        })
        .build() as any,
    })
    .lookup({
      from: DBCollection.PROGRAM_STUDI,
      localField: 'prodiId',
      foreignField: '_id',
      as: 'programStudi',
      unwind: true,
      pipeline: new PipelineBuilder()
        .project({
          nama: 1,
          initial: 1,
          kaprodiId: 1,
        })
        .build() as any,
    })
    .lookup({
      from: DBCollection.DOSEN,
      localField: 'programStudi.kaprodiId',
      foreignField: '_id',
      as: 'koordinator',
      unwind: true,
      pipeline: new PipelineBuilder()
        .getUserData({ keepUserId: true })
        .build() as any,
    })
    .project({
      _id: 0,
      namaLengkap: 0,
      nim: 0,
      email: 0,
      semester: 0,
      nomorHandphone: 0,
      fakultasId: 0,
      prodiId: 0,
      'programStudi.kaprodiId': 0,
    });

  return pipelineBuilder.build();
}
