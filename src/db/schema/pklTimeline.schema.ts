import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { EPKLStatus, IPKLTimeline } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.PKL_TIMELINE,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class PKLTimeline implements IPKLTimeline {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.PKL_TIMELINE,
    required: true,
    index: true,
  })
  pklId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.USER,
    required: false,
    index: true,
  })
  userId: Types.ObjectId | null;

  @Prop({
    type: String,
    enum: EPKLStatus,
    required: true,
    default: EPKLStatus.DITOLAK,
  })
  status: EPKLStatus;

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  deskripsi: string;

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

export type PKLTimelineDocument = HydratedDocument<IPKLTimeline>;
export const PKLTimelineSchema = SchemaFactory.createForClass(PKLTimeline);
export const PKLTimelineModel = mongoose.model<IPKLTimeline>(
  DBCollection.PKL_TIMELINE,
  PKLTimelineSchema,
);
