import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { IProgramStudi } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.PROGRAM_STUDI,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class ProgramStudi implements IProgramStudi {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: DBCollection.FAKULTAS,
  })
  fakultasId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: DBCollection.PROGRAM_STUDI,
  })
  kaprodiId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  nama: string;

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

export type ProgramStudiDocument = HydratedDocument<IProgramStudi>;
export const ProgramStudiSchema = SchemaFactory.createForClass(ProgramStudi);
export const ProgramStudiModel = mongoose.model<IProgramStudi>(
  DBCollection.PROGRAM_STUDI,
  ProgramStudiSchema,
);
