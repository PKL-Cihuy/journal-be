import { Types } from 'mongoose';

export interface IToken {
  _id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  token: string;
}
