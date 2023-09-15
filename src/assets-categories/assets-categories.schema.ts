import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetCategoryDocument = HydratedDocument<AssetCategory>;

@Schema({
  timestamps: true,
})
export class AssetCategory {
  @Prop({ index: true })
  name: string;

  @Prop()
  description: string;
}

export const AssetCategorySchema = SchemaFactory.createForClass(AssetCategory);
