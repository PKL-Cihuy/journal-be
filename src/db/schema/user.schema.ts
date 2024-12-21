import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { EUserType, IUser } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.USER,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class User implements IUser {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: EUserType,
    required: true,
  })
  type: EUserType;

  @Prop({
    type: String,
    required: true,
  })
  namaLengkap: string;

  @Prop({
    type: String,
    required: true,
  })
  nomorHandphone: string;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;
export const UserSchema = SchemaFactory.createForClass(User);
