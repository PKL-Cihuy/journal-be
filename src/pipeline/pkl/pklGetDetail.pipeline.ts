import { Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import {
  IDosen,
  IFakultas,
  IMahasiswa,
  IPKL,
  IProgramStudi,
} from '@/db/interface';

import { PipelineBuilder } from '../builder/pipeline.builder';

/**
 * Collection: PKL
 */
export function PKLGetDetailPipeline(pklId: Types.ObjectId) {
  const pipelineBuilder = new PipelineBuilder<IPKL>()
    .match({ _id: pklId })
    .lookup({
      from: DBCollection.MAHASISWA,
      localField: 'mahasiswaId',
      foreignField: '_id',
      as: 'mahasiswa',
      unwind: true,
      pipeline: new PipelineBuilder<IMahasiswa>()
        .getUserData()
        .project({ fakultasId: 0, prodiId: 0 })
        .build() as any,
    })
    .lookup({
      from: DBCollection.DOSEN,
      localField: 'koordinatorId',
      foreignField: '_id',
      as: 'koordinator',
      unwind: true,
      pipeline: new PipelineBuilder<IDosen>().getUserData().build() as any,
    })
    .lookup({
      from: DBCollection.FAKULTAS,
      localField: 'fakultasId',
      foreignField: '_id',
      as: 'fakultas',
      unwind: true,
      pipeline: new PipelineBuilder<IFakultas>()
        .project({ __v: 0, createdAt: 0, updatedAt: 0 })
        .build() as any,
    })
    .lookup({
      from: DBCollection.PROGRAM_STUDI,
      localField: 'prodiId',
      foreignField: '_id',
      as: 'programStudi',
      unwind: true,
      pipeline: new PipelineBuilder<IProgramStudi>()
        .lookup({
          from: DBCollection.DOSEN,
          localField: 'kaprodiId',
          foreignField: '_id',
          as: 'kaprodi',
          unwind: true,
          pipeline: new PipelineBuilder<IDosen>()
            .getUserData()
            .project({ __v: 0 })
            .build() as any,
        })
        .project({ __v: 0, fakultasId: 0, createdAt: 0, updatedAt: 0 })
        .build() as any,
    })
    .lookup({
      from: DBCollection.JURNAL,
      localField: '_id',
      foreignField: 'journalId',
      as: 'journal',
    })
    .addFields({
      totalJurnal: { $size: '$journal' },
    })
    .project({
      __v: 0,
      journal: 0,
      mahasiswaId: 0,
      koordinatorId: 0,
      fakultasId: 0,
      prodiId: 0,
    });

  return pipelineBuilder.build();
}
