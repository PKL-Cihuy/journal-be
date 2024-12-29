import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { existsSync } from 'fs';
import { isValidObjectId } from 'mongoose';
import * as path from 'path';

import { FileMessage } from '@/message';
import { JournalRepository, PKLRepository } from '@/repository';
import { BadRequest, NotFound } from '@/util/response.util';

import { FileService } from './file.service';

// NOTE: SEE ALSO
// LINK: src/pipe/parseFiles.pipe.ts

@Injectable({ scope: Scope.REQUEST })
export class FileServeService {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,
    private readonly PKLRepository: PKLRepository,
    private readonly journalRepository: JournalRepository,

    private readonly fileService: FileService,
  ) {}

  /**
   * Serve a file
   *
   * @param {string} type - The type of the file
   * @param {string} fileName - The file name
   *
   * @returns {string} The file path
   *
   * @throws {BadRequest} If the file name is invalid
   */
  async serveFile(type: 'pkl' | 'jurnal', fileName: string) {
    const { mhsId, dosenId } = this.req.user!;

    const uploadsDir =
      type == 'pkl'
        ? this.fileService.getUploadsDirPKL()
        : this.fileService.getUploadsDirJurnal();

    // Prevent directory traversal
    const sanitizedFileName = fileName?.replaceAll('..', '').split('/')?.pop();
    const documentId = sanitizedFileName?.split('_')?.[0];

    // Check if the file name is valid
    if (!sanitizedFileName || !documentId || !isValidObjectId(documentId)) {
      throw new BadRequest(FileMessage.FAIL_INVALID_FILE_NAME);
    }

    // Check if user has access to the file
    if (type === 'pkl') {
      await this.PKLRepository.getPKLByUserType(documentId, {
        mhsId,
        dosenId,
      });
    } else {
      const jurnal = await this.journalRepository.getOneOrFail(documentId);

      await this.PKLRepository.getPKLByUserType(String(jurnal.pklId), {
        mhsId,
        dosenId,
      });
    }

    // Resolve the file path
    const filePath = path.resolve(uploadsDir, sanitizedFileName);

    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new NotFound(FileMessage.FAIL_FILE_NOT_FOUND);
    }

    return filePath;
  }
}
