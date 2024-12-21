import { Types } from 'mongoose';

import { IFakultas } from './fakultas.interface';
import { IProgramStudi } from './programStudi.interface';
import { IUser } from './user.interface';

export interface IMahasiswa {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IUser._id}
   * @property `Unique`, `Index`
   */
  userId: Types.ObjectId;

  /**
   * @see {@linkcode IFakultas._id}
   * @property `Index`
   */
  fakultasId: Types.ObjectId;

  /**
   * @see {@linkcode IProgramStudi._id}
   * @property `Index`
   */
  prodiId: Types.ObjectId;

  /**
   * @property `Unique`
   */
  nim: string;

  semester: number;

  createdAt?: Date;

  updatedAt?: Date;
}
