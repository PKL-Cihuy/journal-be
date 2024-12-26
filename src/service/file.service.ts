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
   * Method to generate a unique filename
   *
   * @param {Set<string>} usedFilenames - The used filenames
   * @param {string} originalname - The original name of the file
   * @param {string} prefix - (optional) The prefix for the file name
   *
   * @returns {string} - The unique filename
   */
  private generateUniqueFilename(
    usedFilenames: Set<string>,
    originalname: string,
    prefix?: string,
  ): string {
    // Get the extension
    const [_, extension] = originalname.split('.');

    const _prefix = prefix ?? this.DEFAULT_FILE_PREFIX;
    const filePrefix = _prefix ? `${_prefix}_` : '';

    // Generate the fileName
    const fileNameBase = `${filePrefix}${Date.now()}`;
    let fileName = `${fileNameBase}.${extension}`;

    // Ensure the fileName is unique
    let counter = 1;
    while (usedFilenames.has(fileName)) {
      fileName = `${fileNameBase}_${counter++}.${extension}`;
    }

    // Add the fileName to the usedFilenames
    // This is to ensure that the fileName is unique
    usedFilenames.add(fileName);

    // Return the fileName
    return fileName;
  }

  /**
   * Method to upload files
   *
   * @param {Express.Multer.File[]} files - The files to upload
   * @param {string} folderName - The folder name
   * @param {string} prefix - (optional) The prefix for the file name
   *
   * @returns {string[]} Truncated file paths
   *
   * @throws {InternalServerError} - If failed to save file
   *
   * @example
   * uploadFiles('profiles', files, 'image') // returns ['/profiles/image_XXXXX.ext']
   * uploadFiles('profiles', files); // returns ['/profiles/file_XXXXX.ext']
   */
  uploadFiles(
    folderName: string,
    files: Express.Multer.File[],
    prefix?: string,
  ): string[] {
    try {
      const usedFilenames = new Set<string>();
      const uploadedFilePaths: string[] = [];

      for (const file of files || []) {
        // Generate a unique filename
        const fileName = this.generateUniqueFilename(
          usedFilenames,
          file.originalname,
          prefix,
        );

        // Get the uploads directory
        const uploadsDir = this.getUploadsDir(folderName);

        // Check if upload directory exists
        if (!existsSync(uploadsDir)) {
          mkdirp.sync(uploadsDir);
        }

        // Save the file to the folder
        const filePath = path.resolve(uploadsDir, fileName);
        writeFileSync(filePath, file.buffer);

        // Add the truncated filePath to the uploadedFilePaths
        uploadedFilePaths.push(`/${folderName}/${fileName}`);
      }

      // Return the truncated uploaded file paths
      // Ex: ['/folderName/fileName1.ext', '/folderName/fileName2.ext']
      return uploadedFilePaths;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(FileMessage.FAIL_SAVE_FILE, error.message);
    }
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
      const uploadsDir = this.getUploadsDir(folderName);

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

      return filePath.replaceAll(this.getUploadsDir(), '');
    } catch (error) {
      console.error(error);
      throw new InternalServerError(FileMessage.FAIL_SAVE_FILE, error.message);
    }
  }

  uploadDokumenAwal(
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

  uploadDokumenAkhir(
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
}
