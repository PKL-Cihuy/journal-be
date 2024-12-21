import { Types } from 'mongoose';

import { EPKLStatus, IPKL } from './pkl.interface';
import { IUser } from './user.interface';

export interface IPKLTimeline {
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
   * @description Can be null if PKL Status is modifed by system. Such as when status is changed to `EPKLStatus.GAGAL` when failing to finalize documents
   * @see {@linkcode IUser._id}
   * @property `Nullable`, `Index`
   */
  userId: Types.ObjectId | null;

  /**
   * @property `Unique`
   */
  status: EPKLStatus;

  /**
   * @description Can be empty string "" if created by `mahasiswa`
   */
  deskripsi: string;

  createdAt?: Date;

  updatedAt?: Date;
}
