import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { IDosen } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.DOSEN,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class Dosen implements IDosen {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.USER,
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  nomorInduk: string;

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

export type DosenDocument = HydratedDocument<IDosen>;
export const DosenSchema = SchemaFactory.createForClass(Dosen);
export const DosenModel = mongoose.model<IDosen>(
  DBCollection.DOSEN,
  DosenSchema,
);
