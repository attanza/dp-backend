import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CabinetDocument = HydratedDocument<Cabinet>;

@Schema({
  timestamps: true,
})
export class Cabinet {
  @Prop({ index: true })
  itemName: string;

  @Prop({ index: true })
  serialNumber: string;

  @Prop()
  specificationDetail: string;

  @Prop({ index: true })
  location: string;

  @Prop()
  description: string;
}

export const CabinetSchema = SchemaFactory.createForClass(Cabinet);
