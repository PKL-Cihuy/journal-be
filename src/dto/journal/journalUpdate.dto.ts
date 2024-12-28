import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { JournalCreateResponseDTO } from './journalCreate.dto';

//
// Journal
//
export class JournalUpdateDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  konten?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tanggalMulai?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tanggalSelesai?: number;

  //
  // FILES
  // Only used for swagger documentation so that it shows the file input
  // Actual files should be validated using interceptor and/or pipe
  //
  @ApiProperty({ type: String, format: 'binary' })
  @IsOptional()
  attachments?: Express.Multer.File[];
}

export class JournalUpdateFilesDTO {
  @ApiProperty({ type: String, format: 'binary' })
  @IsOptional()
  attachments?: Express.Multer.File[];
}

//
// Response
//
export class JournalUpdateResponseDTO extends JournalCreateResponseDTO {}
