import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { IFakultas } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.FAKULTAS,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class Fakultas implements IFakultas {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  nama: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  initial: string;

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

export type FakultasDocument = HydratedDocument<IFakultas>;
export const FakultasSchema = SchemaFactory.createForClass(Fakultas);
