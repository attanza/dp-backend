import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Asset } from '../assets/assets.schema';

export type NotifyDocument = HydratedDocument<Notify>;

@Schema({
  timestamps: true,
})
export class Notify {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' })
  asset: Asset;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  lastNotify: Date;

  @Prop()
  nextNotify: Date;
}

export const NotifySchema = SchemaFactory.createForClass(Notify);
