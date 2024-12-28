import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { EPKLStatus, IPKL } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.PKL,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class PKL implements IPKL {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.USER,
    required: true,
    index: true,
  })
  mahasiswaId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.DOSEN,
    required: true,
    index: true,
  })
  koordinatorId: Types.ObjectId;

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
  namaInstansi: string;

  @Prop({
    type: String,
    required: true,
  })
  alamatInstansi: string;

  @Prop({
    type: Date,
    required: true,
  })
  tanggalMulai: Date;

  @Prop({
    type: Date,
    required: true,
  })
  tanggalSelesai: Date;

  @Prop({
    type: String,
    enum: EPKLStatus,
    required: true,
  })
  status: EPKLStatus;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  approvedAt: Date | null;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  rejectedAt: Date | null;

  @Prop({
    type: Number,
    required: false,
    default: null,
  })
  rejectedAtSemester: number | null;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  finishedAt: Date | null;

  @Prop({
    type: String,
    required: true,
  })
  dokumenDiterima: string;

  @Prop({
    type: String,
    required: true,
  })
  dokumenMentor: string;

  @Prop({
    type: String,
    required: true,
  })
  dokumenPimpinan: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  dokumenSelesai: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  dokumenLaporan: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  dokumenPenilaian: string | null;

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

export type PKLDocument = HydratedDocument<IPKL>;
export const PKLSchema = SchemaFactory.createForClass(PKL);
export const PKLModel = mongoose.model<IPKL>(DBCollection.PKL, PKLSchema);
