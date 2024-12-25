import { Types } from 'mongoose';

import { IJournal } from '@/db/interface';
import { JournalListQueryDTO } from '@/dto/journal';

import { PipelineBuilder } from '../builder/pipeline.builder';
import {
  generateArrayFilter,
  generateDateQuery,
  generateRangeQuery,
} from '../builder/query.builder';

export function journalListPipeline(
  pklId: Types.ObjectId,
  query: JournalListQueryDTO,
) {
  const {
    search,
    limit,
    page,
    sortBy,
    sortOrder,

    status,
    tanggalMulai,
    tanggalSelesai,
    createdAt,
    updatedAt,
  } = query;

  const pipelineBuilder = new PipelineBuilder<IJournal>()
    .match({ pklId: pklId })
    .project({ __v: 0, pklId: 0 })
    .match({
      status: generateArrayFilter(status),
      tanggalMulai: generateRangeQuery(tanggalMulai),
      tanggalSelesai: generateRangeQuery(tanggalSelesai),
      createdAt: generateDateQuery(createdAt),
      updatedAt: generateDateQuery(updatedAt),
    })
    .toDateString(['createdAt', 'updatedAt', 'tanggalMulai', 'tanggalSelesai'])
    .search(search, [
      'konten',
      'status',

      'createdAtString',
      'updatedAtString',
      'tanggalMulaiString',
      'tanggalSelesaiString',
    ])
    .project({
      createdAtString: 0,
      updatedAtString: 0,
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
