import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { PKLCreateResponseDTO } from './pklCreate.dto';

export class PKLUpdateDTO {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  namaInstansi?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  alamatInstansi?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tanggalMulai?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tanggalSelesai?: number;

  //
  // FILES
  // Only used for swagger documentation so that it shows the file input
  // Actual files should be validated using interceptor and/or pipe
  //
  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenDiterima?: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenMentor?: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenPimpinan?: Express.Multer.File;
}

export class PKLUpdateFilesDTO {
  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenDiterima?: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenMentor?: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenPimpinan?: Express.Multer.File;
}

export class PKLUpdateResponseDTO extends PKLCreateResponseDTO {}
