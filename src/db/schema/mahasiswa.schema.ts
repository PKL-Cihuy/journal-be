import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { IMahasiswa } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.MAHASISWA,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class Mahasiswa implements IMahasiswa {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.USER,
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.FAKULTAS,
    required: true,
    index: true,
  })
  fakultasId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.PROGRAM_STUDI,
    required: true,
    index: true,
  })
  prodiId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  nim: string;

  @Prop({
    type: Number,
    required: true,
  })
  semester: number;

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

export type MahasiswaDocument = HydratedDocument<IMahasiswa>;
export const MahasiswaSchema = SchemaFactory.createForClass(Mahasiswa);
export const MahasiswaModel = mongoose.model<IMahasiswa>(
  DBCollection.MAHASISWA,
  MahasiswaSchema,
);
