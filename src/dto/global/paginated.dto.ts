import { T } from '@faker-js/faker/dist/airline-BnpeTvY9';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class PaginatedDTO<T> {
  @ApiProperty({ type: Number, example: 1, default: 0 })
  @IsNumber()
  @IsNotEmpty()
  totalRecords: number;

  @ApiProperty({ type: T, isArray: true, default: [] })
  @IsArray()
  @IsNotEmpty()
  data: T[];
}
