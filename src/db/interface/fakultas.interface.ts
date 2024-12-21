import { Types } from 'mongoose';

export interface IFakultas {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @property `Unique`
   */
  nama: string;

  /**
   * @property `Unique`
   */
  initial: string;
}
