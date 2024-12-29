import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

//
// PKL
//
export class PKLFinalizeDTO {
  //
  // FILES
  // Only used for swagger documentation so that it shows the file input
  // Actual files should be validated using interceptor and/or pipe
  //
  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenLaporan: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenPenilaian: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenSelesai: Express.Multer.File;
}

export class PKLFinalizeFilesDTO {
  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenLaporan: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenPenilaian: Express.Multer.File;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  dokumenSelesai: Express.Multer.File;
}
