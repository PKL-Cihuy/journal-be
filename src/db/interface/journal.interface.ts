import { Types } from 'mongoose';
import { IPKL } from './pkl.interface';

export enum EJournalStatus {
  DIPROSES = 'Diproses',
  DITOLAK = 'Ditolak',
  DITERIMA = 'Diterima',
}

export interface IJournal {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IPKL._id}
   * @property `Index`
   */
  pklId: Types.ObjectId;

  /**
   * @property `Index`
   */
  status: EJournalStatus;

  /**
   * @description Array of path to file
   * @example
   * [
   *    'uploads/journal/{journalId}_attachment1.pdf',
   *    'uploads/journal/{journalId}_attachment2.pdf'
   * ]
   * @property `Unique`
   */
  attachments: string[];

  createdAt?: Date;

  updatedAt?: Date;
}
