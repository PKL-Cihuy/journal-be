import { Types } from 'mongoose';

import { EJournalStatus, IJournal } from './journal.interface';
import { IUser } from './user.interface';

export interface IJournalTimeline {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IJournal._id}
   * @property `Index`
   */
  journalId: Types.ObjectId;

  /**
   * @description Different from `IPKLJournal.userId`, this one cannot be null since system won't modify journal status
   * @see {@linkcode IUser._id}
   * @property `Nullable`, `Index`
   */
  userId: Types.ObjectId;

  /**
   * @default EJournalStatus.DIPROSES
   */
  status: EJournalStatus;

  /**
   * @description Can be empty string "" if created by `mahasiswa`
   */
  deskripsi: string;

  createdAt?: Date;

  updatedAt?: Date;
}
