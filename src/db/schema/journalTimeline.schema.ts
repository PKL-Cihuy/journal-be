import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { EJournalStatus, IJournalTimeline } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.JURNAL_TIMELINE,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class JournalTimeline implements IJournalTimeline {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: DBCollection.JURNAL,
  })
  journalId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: DBCollection.USER,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: EJournalStatus,
    required: true,
  })
  status: EJournalStatus;

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

export type JournalTimelineDocument = HydratedDocument<IJournalTimeline>;
export const JournalTimelineSchema =
  SchemaFactory.createForClass(JournalTimeline);
export const JournalTimelineModel = mongoose.model<IJournalTimeline>(
  DBCollection.JURNAL_TIMELINE,
  JournalTimelineSchema,
);
