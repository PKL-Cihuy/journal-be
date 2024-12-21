import { Types } from 'mongoose';

export enum EUserType {
  MAHASISWA = 'Mahasiswa',
  DOSEN = 'Dosen',
  ADMIN = 'Admin',
}

export interface IUser {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  email: string;

  /**
   * @description BCrypt hashed password
   */
  password: string;

  type: EUserType;

  namaLengkap: string;

  nomorHandphone: string;

  createdAt?: Date;

  updatedAt?: Date;
}
