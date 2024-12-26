import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @Transform(({ value }) => value[0])
  @IsNotEmpty()
  dokumenDiterima: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @Transform(({ value }) => value[0])
  @IsNotEmpty()
  dokumenMentor: Express.Multer.File;

  @ApiProperty({ type: String, format: 'binary' })
  @Transform(({ value }) => value[0])
  @IsNotEmpty()
  dokumenPimpinan: Express.Multer.File;
}
