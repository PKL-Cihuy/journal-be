import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { DBCollection } from '@/db/collection.db';
import { EJournalStatus, IJournal } from '@/db/interface';

@Schema({
  // Override mongoose pluralization
  collection: DBCollection.JURNAL,
  // Set default collation
  collation: { locale: 'en', strength: 3 },
  autoIndex: true,
  timestamps: true,
})
export class Journal implements IJournal {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: DBCollection.USER,
  })
  pklId: Types.ObjectId;

  @Prop({
    type: String,
    enum: EJournalStatus,
    required: true,
    default: EJournalStatus.DIPROSES,
  })
  status: EJournalStatus;

  @Prop({
    type: [String],
    required: true,
  })
  attachments: string[];

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

export type JournalDocument = HydratedDocument<IJournal>;
export const JournalSchema = SchemaFactory.createForClass(Journal);
export const JournalModel = mongoose.model<IJournal>(
  DBCollection.JURNAL,
  JournalSchema,
);
