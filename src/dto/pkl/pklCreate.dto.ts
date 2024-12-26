import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { EPKLStatus } from '@/db/interface';

//
// PKL
//
export class PKLCreateDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  namaInstansi: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tanggalMulai: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tanggalSelesai: number;

  //
  // FILES
  // Only used for swagger documentation so that it shows the file input
  // Actual files should be validated using interceptor and/or pipe
  //
  @ApiProperty({ type: String, format: 'binary' })
  @IsOptional()
  dokumenDiterima: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @IsOptional()
  dokumenMentor: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @IsOptional()
  dokumenPimpinan: Express.Multer.File;
}

export class PKLCreateFilesDTO {
  @ApiProperty({ type: String, format: 'binary' })
  @IsNotEmpty()
  dokumenDiterima: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @IsNotEmpty()
  dokumenMentor: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @IsNotEmpty()
  dokumenPimpinan: Express.Multer.File;
}

//
// Response
//
export class PKLCreateResponseDTO {
  @ApiProperty({ type: String, example: '676d6fcc0df9be294bff9279' })
  _id: string;

  @ApiProperty({ type: String, example: '67697c4ece2a4f39e4dce1b1' })
  mahasiswaId: string;

  @ApiProperty({ type: String, example: '67697c4ece2a4f39e4dce19a' })
  koordinatorId: string;

  @ApiProperty({ type: String, example: '67697c4ece2a4f39e4dce19e' })
  fakultasId: string;

  @ApiProperty({ type: String, example: '67697c4ece2a4f39e4dce1a8' })
  prodiId: string;

  @ApiProperty({ type: String, example: 'PT Moga Sukses' })
  namaInstansi: string;

  @ApiProperty({ type: Number, example: '2024-12-26T15:04:38.748Z' })
  tanggalMulai: number;

  @ApiProperty({ type: Number, example: '2024-12-26T15:04:38.748Z' })
  tanggalSelesai: number;

  @ApiProperty({ type: String, example: EPKLStatus.MENUNGGU_PERSETUJUAN })
  status: string;

  @ApiProperty({ type: String, example: null })
  approvedAt: string;

  @ApiProperty({ type: String, example: null })
  rejectedAt: string;

  @ApiProperty({ type: String, example: null })
  rejectedAtSemester: string;

  @ApiProperty({ type: String, example: null })
  finishedAt: string;

  @ApiProperty({
    type: String,
    example: '/pkl/676d6fcc0df9be294bff9279_dokumen_diterima.pdf',
  })
  dokumenDiterima: string;

  @ApiProperty({
    type: String,
    example: '/pkl/676d6fcc0df9be294bff9279_dokumen_mentor.pdf',
  })
  dokumenMentor: string;

  @ApiProperty({
    type: String,
    example: '/pkl/676d6fcc0df9be294bff9279_dokumen_pimpinan.pdf',
  })
  dokumenPimpinan: string;

  @ApiProperty({ type: String, example: null })
  dokumenSelesai: string;

  @ApiProperty({ type: String, example: null })
  dokumenLaporan: string;

  @ApiProperty({ type: String, example: null })
  dokumenPenilaian: string;

  @ApiProperty({ type: String, example: '2024-12-26T15:01:32.008Z' })
  createdAt: string;

  @ApiProperty({ type: String, example: '2024-12-26T15:01:32.008Z' })
  updatedAt: string;
}
