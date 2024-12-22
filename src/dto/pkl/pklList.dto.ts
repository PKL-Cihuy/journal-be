import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { EPKLStatus } from '@/db/interface';
import { ParseQuery } from '@/decorator/parseQuery.decorator';
import { apiPropertyGenerateExamplesMultiple } from '@/util/apiPropertyGenerateExample.util';

import { ListQueryDTO } from '../global/listQuery.dto';

//
// PKL
//
export class PKLListQueryDTO extends ListQueryDTO {
  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of KPL Status',
    examples: apiPropertyGenerateExamplesMultiple(Object.values(EPKLStatus)),
  })
  @ParseQuery('string')
  @IsOptional()
  status?: string;

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
  finishedAt?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of number [totalJurnalMin, totalJurnalMax]',
  })
  @ParseQuery('json')
  @IsOptional()
  totalJurnal?: number[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of objectId (mahasiswa _id)',
  })
  @ParseQuery('objectIdArr')
  @IsOptional()
  mahasiswa?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of objectId (koordinator _id)',
  })
  @ParseQuery('objectIdArr')
  @IsOptional()
  koordinator?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of objectId (fakultas _id)',
  })
  @ParseQuery('objectIdArr')
  @IsOptional()
  fakultas?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Stringified array of objectId (dosen _id)',
  })
  @ParseQuery('objectIdArr')
  @IsOptional()
  kaprodi?: string[];
}

//
// Response
//
export class PKLListResponseDTO {
  @ApiProperty({ type: String, example: '676778a37d05098d38b82665' })
  _id: string;

  @ApiProperty({ type: String, example: 'Yayasan Kahyang Tbk' })
  namaInstansi: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalMulai: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalSelesai: Date;

  @ApiProperty({ type: String, example: EPKLStatus.MENUNGGU_PERSETUJUAN })
  status: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  approvedAt: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  rejectedAt: Date;

  @ApiProperty({ type: Number, example: 5 })
  rejectedAtSemester: number;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  finishedAt: Date;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_diterima.pdf',
  })
  dokumenDiterima: string;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_mentor.pdf',
  })
  dokumenMentor: string;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_pimpinan.pdf',
  })
  dokumenPimpinan: string;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_selesai.pdf',
  })
  dokumenSelesai: string;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_laporan.pdf',
  })
  dokumenLaporan: string;

  @ApiProperty({
    type: String,
    example: '/uploads/pkl/676778a37d05098d38b82665_dokumen_penilaian.pdf',
  })
  dokumenPenilaian: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  createdAt: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  updatedAt: Date;

  @ApiProperty({
    type: Object,
    example: {
      _id: '676778a37d05098d38b825d5',
      nim: '5125626704',
      semester: 7,
      email: 'mhs@mail.com',
      namaLengkap: 'Nainggolan Ganjaran',
      nomorHandphone: '+6266805666307',
    },
  })
  mahasiswa: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '676778a37d05098d38b8255f',
      nomorInduk: '6310100449',
      email: 'dosen@mail.com',
      namaLengkap: 'Wirda Melani',
      nomorHandphone: '+629686348304',
    },
  })
  koordinator: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '676778a37d05098d38b82567',
      nama: 'Fakultas 2',
      initial: 'F2',
    },
  })
  fakultas: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '676778a37d05098d38b8256d',
      kaprodiId: '676778a37d05098d38b8255e',
      nama: 'Program Studi F1 4',
      kaprodi: {
        _id: '676778a37d05098d38b8255e',
        nomorInduk: '8072023705',
        email: 'kaprodi@mail.com',
        namaLengkap: 'Lazuardi Nasrullah',
        nomorHandphone: '+6293753018493',
      },
    },
  })
  programStudi: object;

  @ApiProperty({ type: Number, example: 1 })
  totalJurnal: number;
}
