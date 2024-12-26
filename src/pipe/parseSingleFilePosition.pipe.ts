import { PipeTransform } from '@nestjs/common';

/**
 * Used to extract a single file from a field. Useful when using FileFieldsInterceptor.
 */
export class ParseSingleFilePositionPipe
  implements PipeTransform<Record<string, Express.Multer.File[]>>
{
  constructor(private readonly fields: string[]) {}

  async transform(files: Record<string, Express.Multer.File[]>) {
    const parsed: Record<string, Express.Multer.File> = {};

    for (const field of this.fields) {
      if (files[field]) {
        parsed[field] = files[field][0];
      }
    }

    return parsed;
  }
}
