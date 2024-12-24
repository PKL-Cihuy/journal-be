import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { EJournalStatus } from '@/db/interface';
import { ParseQuery } from '@/decorator/parseQuery.decorator';
import { apiPropertyGenerateExamplesMultiple } from '@/util/apiPropertyGenerateExample.util';

import { ListQueryDTO } from '../global/listQuery.dto';

//
// Journal
//
export class JournalListQueryDTO extends ListQueryDTO {
  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of Journal status',
    examples: apiPropertyGenerateExamplesMultiple(
      Object.values(EJournalStatus),
    ),
  })
  @ParseQuery('json')
  @IsOptional()
  status?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of number [dateMin, dateMax]',
  })
  @ParseQuery('json')
  @IsOptional()
  tanggalMulai?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of number [dateMin, dateMax]',
  })
  @ParseQuery('json')
  @IsOptional()
  tanggalSelesai?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of number [dateMin, dateMax]',
  })
  @ParseQuery('json')
  @IsOptional()
  createdAt?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of number [dateMin, dateMax]',
  })
  @ParseQuery('json')
  @IsOptional()
  updatedAt?: number[];
}

//
// Response
//
export class JournalListResponseDTO {
  @ApiProperty({ type: String, example: '676778a37d05098d38b82665' })
  _id: string;

  @ApiProperty({ type: String, example: 'Konten jurnal' })
  deskripsi: string;

  @ApiProperty({
    type: Array,
    example: [
      '/uploads/jurnal/676778a37d05098d38b82665_1.jpg',
      '/uploads/jurnal/676778a37d05098d38b82665_2.pdf',
    ],
  })
  attachments: string[];

  @ApiProperty({ type: String, example: EJournalStatus.DITERIMA })
  status: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalMulai: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalSelesai: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  createdAt: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  updatedAt: Date;
}
