import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

import { InternalServerError } from '@/util/response.util';

// NOTE: SEE ALSO
// LINK: src/pipe/parseFiles.pipe.ts

@Injectable()
export class FileService {
  protected DEFAULT_FILE_PREFIX = 'file';

  /**
   * Method to get the base directory
   *
   * @returns {string} The base directory
   */
  getBaseDir(): string {
    const baseDir = path.resolve(__dirname);

    return baseDir;
  }

  /**
   * Method to get the uploads directory
   *
   * @param {string} folderName - The folder name
   *
   * @returns {string} The uploads directory (baseDir + folderName)
   */
  getUploadsDir(folderName: string): string {
    return path.resolve(this.getBaseDir(), folderName);
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

    // Generate the fileName
    const fileNameBase = `${prefix ?? this.DEFAULT_FILE_PREFIX}_${Date.now()}`;
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
      throw new InternalServerError(
        'FileService: Failed to save file',
        error.message,
      );
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
  deleteFiles(folderName: string, fileNames: string[]): number {
    let deleted = 0;

    try {
      // Get the uploads directory
      const uploadsDir = this.getUploadsDir(folderName);

      for (const fileName of fileNames || []) {
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
        'FileService: Failed to delete file',
        error.message,
      );
    }
  }
}
