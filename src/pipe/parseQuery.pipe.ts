import { Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { QueryParser } from '@/decorator/parseQuery.decorator';

@Injectable()
export class ParseQueryPipe<T> implements PipeTransform {
  constructor(private readonly dtoClass: new () => T) {}

  transform(query: T): T {
    const dtoObject = plainToInstance(this.dtoClass, query);
    return QueryParser.parseQuery(dtoObject);
  }
}
