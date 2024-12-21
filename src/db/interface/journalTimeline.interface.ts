import { Types } from 'mongoose';
import { IUser } from './user.interface';
import { EJournalStatus } from './journal.interface';

export interface IJournalimeline {
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
  userId: Types.ObjectId | null;

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
