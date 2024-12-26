import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { DBCollection } from '../collection.db';
import { IToken } from '../interface/token.interface';

@Schema({ collection: DBCollection.TOKEN })
export class Token implements IToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.USER,
    required: true,
  })
  userId: string | mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export const TokenModel = mongoose.model(DBCollection.TOKEN, TokenSchema);
