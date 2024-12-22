import { ParseFilePipe, PipeTransform } from '@nestjs/common';
import { Express } from 'express';
import 'multer';

// NOTE: REFERENCE
// - https://github.com/nestjs/docs.nestjs.com/issues/2424#issuecomment-1721564275

// NOTE: EXAMPLE USAGE
// dto.ts
// export class MyFilesDTO {
//   file1: Express.Multer.File[];
//   file2: Express.Multer.File[];
// }

// controller.ts
// @UseInterceptors(
//   FileFieldsInterceptor([
//     { name: 'file1', maxCount: 1 },
//     { name: 'file2', maxCount: 2 },
//   ]),
// )
// myControllerMethod(
//   @UploadedFiles(
//     new ParseFilesPipe(
//       new ParseFilePipeBuilder()
//         .addFileTypeValidator({
//           fileType: /(png|jpg|jpeg|pdf)/,
//         })
//         .addMaxSizeValidator({
//           maxSize: 1024 * 1024 * 1,
//         })
//         .build({
//           fileIsRequired: false, // optional, default is true
//           errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//         }),
//     ),
//   )
//   files: MyFilesDTO,
// ) {}

export class ParseFilesPipe implements PipeTransform<Express.Multer.File[]> {
  constructor(private readonly pipe: ParseFilePipe) {}

  async transform(
    files:
      | Express.Multer.File[]
      | { [key: string]: Express.Multer.File }
      | { [key: string]: Express.Multer.File[] },
  ) {
    const filesToCheck: Express.Multer.File[] = Array.isArray(files)
      ? files
      : Object.values(files).flat();

    for (const file of filesToCheck) await this.pipe.transform(file);

    return files;
  }
}
