import { Types } from 'mongoose';
import { IDosen } from './dosen.interface';
import { IFakultas } from './fakultas.interface';

export interface IProgramStudi {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IFakultas._id}
   * @property `Index`
   */
  fakultasId: Types.ObjectId;

  /**
   * @see {@linkcode IDosen._id}
   * @property `Index`
   */
  kaprodiId: Types.ObjectId;

  /**
   * @property `Unique`
   */
  nama: string;

  createdAt?: Date;

  updatedAt?: Date;
}
