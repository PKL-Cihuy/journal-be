import { Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import {
  IDosen,
  IFakultas,
  IMahasiswa,
  IPKL,
  IProgramStudi,
} from '@/db/interface';
import { PKLListQueryDTO } from '@/dto/pkl/pklList.dto';

import { PipelineBuilder } from '../builder/pipeline.builder';
import {
  generateArrayFilter,
  generateDateQuery,
  generateRangeQuery,
} from '../builder/query.builder';

function generateUserFilter(userData?: {
  mahasiswaId?: string;
  koordinatorId?: string;
}) {
  const { mahasiswaId, koordinatorId } = userData || {};

  if (mahasiswaId) {
    return { mahasiswaId: new Types.ObjectId(mahasiswaId) };
  }
  if (koordinatorId) {
    return { koordinatorId: new Types.ObjectId(koordinatorId) };
  }
  return {};
}

/**
 * Collection: PKL
 */
export function PKLListPipeline(
  query: PKLListQueryDTO,
  userData?: {
    mahasiswaId?: string;
    koordinatorId?: string;
  },
) {
  const {
    search,
    limit,
    page,
    sortBy,
    sortOrder,

    createdAt,
    fakultas,
    finishedAt,
    kaprodi,
    koordinator,
    mahasiswa,
    status,
    tanggalMulai,
    tanggalSelesai,
    totalJurnal,
  } = query;

  const pipelineBuilder = new PipelineBuilder<IPKL>()
    .match(generateUserFilter(userData))
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
      dokumenDiterima: 0,
      dokumenMentor: 0,
      dokumenPimpinan: 0,
      dokumenSelesai: 0,
      dokumenLaporan: 0,
      dokumenPenilaian: 0,
    })
    .match({
      createdAt: generateDateQuery(createdAt),
      'fakultas._id': generateArrayFilter(fakultas),
      finishedAt: generateDateQuery(finishedAt),
      'fakultas.kaprodi._id': generateArrayFilter(kaprodi),
      'koordinator._id': generateArrayFilter(koordinator),
      'mahasiswa._id': generateArrayFilter(mahasiswa),
      status: generateArrayFilter(status),
      tanggalMulai: generateRangeQuery(tanggalMulai),
      tanggalSelesai: generateRangeQuery(tanggalSelesai),
      totalJurnal: generateRangeQuery(totalJurnal),
    })
    .toDateString(['createdAt', 'finishedAt', 'tanggalMulai', 'tanggalSelesai'])
    .search(search, [
      'namaInstansi',
      'status',
      'mahasiswa.namaLengkap',
      'koordinator.namaLengkap',
      'fakultas.nama',
      'fakultas.initial',
      'programStudi.nama',

      'createdAtString',
      'finishedAtString',
      'tanggalMulaiString',
      'tanggalSelesaiString',
    ])
    .project({
      createdAtString: 0,
      finishedAtString: 0,
      tanggalMulaiString: 0,
      tanggalSelesaiString: 0,
    })
    .pagination({
      limit,
      page,
      sortBy,
      sortOrder,
      sortObject: { createdAt: -1 },
    });

  return pipelineBuilder.build();
}
