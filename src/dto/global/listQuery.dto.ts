import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SortDirection } from 'mongodb';

import { ParseQuery } from '@/decorator/parseQuery.decorator';

export class ListQueryDTO {
  @ApiPropertyOptional({ type: String })
  @ParseQuery('string')
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: Number })
  @ParseQuery('int')
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ type: Number })
  @ParseQuery('int')
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @ParseQuery('string')
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    type: Number,
    enum: ['1', '-1'],
  })
  @ParseQuery('sortDirection')
  @IsOptional()
  sortOrder?: SortDirection;
}
