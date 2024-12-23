import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { BadRequest } from '@/util/response.util';

// Pipe to validate mongo id
@Injectable()
export class IsValidObjectIdPipe implements PipeTransform {
  async transform(value: string) {
    const isValid = isValidObjectId(value);

    // Throw BadRequest if value is not a valid mongo id
    if (!isValid) {
      throw new BadRequest(`${value} is not a valid mongo id`);
    }

    return value;
  }
}
