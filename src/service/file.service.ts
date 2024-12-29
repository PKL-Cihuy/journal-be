import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

import { FileMessage } from '@/message';
import { InternalServerError } from '@/util/response.util';

// NOTE: SEE ALSO
// LINK: src/pipe/parseFiles.pipe.ts

@Injectable()
export class FileService {
  protected readonly DEFAULT_FILE_PREFIX = 'file';
  public readonly PKL_FOLDER_NAME = 'pkl';
  public readonly JURNAL_FOLDER_NAME = 'jurnal';

  /**
   * Method to get the base directory
   *
   * @returns {string} The base directory
   */
  getBaseDir(): string {
    return process.cwd();
  }

  /**
   * Method to get the uploads directory
   *
   * @param {string} folderName - The folder name
   *
   * @returns {string} The uploads directory (baseDir + folderName)
   */
  getUploadsDir(folderName?: string): string {
    return path.resolve(this.getBaseDir(), 'uploads', folderName ?? '');
  }

  /**
   * Helper method to get the uploads directory for PKL
   *
   * @returns {string} The uploads directory for PKL
   */
  getUploadsDirPKL(): string {
    return this.getUploadsDir(this.PKL_FOLDER_NAME);
  }

  /**
   * Helper method to get the uploads directory for Jurnal
   *
   * @returns {string} The uploads directory for Jurnal
   */
  getUploadsDirJurnal(): string {
    return this.getUploadsDir(this.JURNAL_FOLDER_NAME);
  }

  /**
   * Method to delete files
   *
   * @param {string} folderName - The folder name where the target files are located
   * @param {string[]} fileNames - The file names to delete
   *
   * @returns {number} - Amount of files deleted
   *
   * @throws {InternalServerError} - If failed to delete file
   *
   * @note
   * Optionally should check if the amount of deleted files is equal to the amount of target files
   */
  deleteFiles(folderName: string, fileNames: (string | undefined)[]): number {
    let deleted = 0;

    try {
      // Get the uploads directory
      const uploadsDir = this.dirExist(folderName);

      for (const fileName of fileNames || []) {
        if (
          !fileName ||
          fileName === 'undefined' ||
          fileName === 'null' ||
          fileName === 'false'
        ) {
          continue;
        }

        // Get the file path
        const filePath = path.resolve(uploadsDir, fileName);

        // Check if the file exists
        if (existsSync(filePath)) {
          // Delete the file
          unlinkSync(filePath);

          deleted += 1;
        }
      }

      return deleted;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        FileMessage.FAIL_DELETE_FILE,
        error.message,
      );
    }
  }

  private dirExist(folder?: string) {
    try {
      // Get the uploads directory
      const uploadsDir = this.getUploadsDir(folder ?? '');

      // Check if upload directory exists
      if (!existsSync(uploadsDir)) {
        // Create the directory if it doesn't exist
        mkdirp.sync(uploadsDir);
      }

      return uploadsDir;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        FileMessage.FAIL_CREATE_DIRECTORY,
        error.message,
      );
    }
  }

  extractFileMetadata(file: Express.Multer.File) {
    const { originalname } = file;

    const fileParts = originalname.split('.');
    const extension = fileParts.pop();
    const fileName = fileParts.join('.');

    return { ...file, fileName, extension };
  }

  uploadFileRaw(
    fileName: string,
    file: Express.Multer.File,
    opts: {
      folderName: string;
      uploadsDir?: string;
    },
  ): string;
  uploadFileRaw(
    fileName: string,
    file: Express.Multer.File,
    opts: {
      folderName?: string;
      uploadsDir: string;
    },
  ): string;
  uploadFileRaw(
    fileName: string,
    file: Express.Multer.File,
    opts: {
      folderName?: string;
      uploadsDir?: string;
    },
  ) {
    const { folderName, uploadsDir } = opts ?? {};

    let actualUploadsDir: string;
    if (folderName) {
      actualUploadsDir = this.dirExist(folderName);
    } else {
      actualUploadsDir = uploadsDir!;
    }

    const fileMetadata = this.extractFileMetadata(file);

    try {
      // Save the file to the folder
      const filePath = path.resolve(
        actualUploadsDir,
        `${fileName}.${fileMetadata.extension}`,
      );
      writeFileSync(filePath, file.buffer);

      return (
        filePath
          // Remove the base directory from the file path
          .replaceAll(this.getUploadsDir(), '')
          // Replace backslashes with forward slashes
          .replaceAll('\\', '/')
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerError(FileMessage.FAIL_SAVE_FILE, error.message);
    }
  }

  // REVIEW: Don't overwrite old files in case a rollback happens
  uploadPKLDokumenAwal(
    pklId: string,
    files: {
      dokumenDiterima?: Express.Multer.File;
      dokumenMentor?: Express.Multer.File;
      dokumenPimpinan?: Express.Multer.File;
    },
  ) {
    const uploadsDir = this.dirExist(this.PKL_FOLDER_NAME);

    let file1, file2, file3: string | undefined;

    if (files.dokumenDiterima) {
      file1 = this.uploadFileRaw(
        `${pklId}_dokumen_diterima`,
        files.dokumenDiterima,
        { uploadsDir },
      );
    }

    if (files.dokumenMentor) {
      file2 = this.uploadFileRaw(
        `${pklId}_dokumen_mentor`,
        files.dokumenMentor,
        { uploadsDir },
      );
    }

    if (files.dokumenPimpinan) {
      file3 = this.uploadFileRaw(
        `${pklId}_dokumen_pimpinan`,
        files.dokumenPimpinan,
        { uploadsDir },
      );
    }
    return {
      dokumenDiterima: file1,
      dokumenMentor: file2,
      dokumenPimpinan: file3,
    };
  }

  // REVIEW: Don't overwrite old files in case a rollback happens
  uploadPKLDokumenAkhir(
    pklId: string,
    files: {
      dokumenSelesai?: Express.Multer.File;
      dokumenLaporan?: Express.Multer.File;
      dokumenPenilaian?: Express.Multer.File;
    },
  ) {
    const uploadsDir = this.dirExist(this.PKL_FOLDER_NAME);

    let file1, file2, file3: string | undefined;

    if (files.dokumenSelesai) {
      file1 = this.uploadFileRaw(
        `${pklId}_dokumen_selesai`,
        files.dokumenSelesai,
        { uploadsDir },
      );
    }

    if (files.dokumenLaporan) {
      file2 = this.uploadFileRaw(
        `${pklId}_dokumen_laporan`,
        files.dokumenLaporan,
        { uploadsDir },
      );
    }

    if (files.dokumenPenilaian) {
      file3 = this.uploadFileRaw(
        `${pklId}_dokumen_penilaian`,
        files.dokumenPenilaian,
        { uploadsDir },
      );
    }

    return {
      dokumenSelesai: file1,
      dokumenLaporan: file2,
      dokumenPenilaian: file3,
    };
  }

  // REVIEW: Don't overwrite old files in case a rollback happens
  uploadJournalAttachments(jurnalId: string, files?: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadsDir = this.dirExist(this.JURNAL_FOLDER_NAME);

    const uploadedFiles = files.map((file, index) => {
      return this.uploadFileRaw(`${jurnalId}_attachment_${index + 1}`, file, {
        uploadsDir,
      });
    });

    return uploadedFiles;
  }
}
