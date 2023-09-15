import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AssetCategory } from '../assets-categories/assets-categories.schema';

export type AssetDocument = HydratedDocument<Asset>;

@Schema({
  timestamps: true,
})
export class Asset {
  @Prop({ index: true })
  name: string;

  @Prop({ index: true })
  serialNumber: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'AssetCategory' }])
  categories: AssetCategory[];

  @Prop()
  specification: string;

  @Prop()
  description: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
