import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { EJournalStatus } from '@/db/interface';

//
// Journal
//
export class JournalCreateDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  konten: string;

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
  attachments: Express.Multer.File[];
}

export class JournalCreateFilesDTO {
  @ApiProperty({ type: String, format: 'binary' })
  @IsNotEmpty()
  attachments: Express.Multer.File[];
}

//
// Response
//
export class JournalCreateResponseDTO {
  @ApiProperty({ type: String, example: '676fa1dae30d435ce3b5fa9a' })
  _id: string;

  @ApiProperty({ type: String, example: '676f89329045dff09532be53' })
  pklId: string;

  @ApiProperty({ type: String, example: EJournalStatus.DIPROSES })
  status: EJournalStatus;

  @ApiProperty({ type: String, example: 'Hari ini saya...' })
  konten: string;

  @ApiProperty({
    type: [String],
    example: [
      '/jurnal/676fa1dae30d435ce3b5fa9a_attachment_1.PNG',
      '/jurnal/676fa1dae30d435ce3b5fa9a_attachment_2.PNG',
    ],
  })
  attachments: string[];

  @ApiProperty({ type: Date, example: '2024-12-28T06:59:38.286Z' })
  tanggalMulai: Date;

  @ApiProperty({ type: Date, example: '2024-12-28T06:59:38.286Z' })
  tanggalSelesai: Date;

  @ApiProperty({ type: Date, example: '2024-12-28T06:59:38.286Z' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2024-12-28T06:59:38.286Z' })
  updatedAt: Date;
}
