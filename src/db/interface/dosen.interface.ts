import { Types } from 'mongoose';

import { IUser } from './user.interface';

export interface IDosen {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IUser._id}
   * @property `Index`
   */
  userId: Types.ObjectId;

  /**
   * @property `Unique`
   */
  nomorInduk: string;

  createdAt?: Date;

  updatedAt?: Date;
}
