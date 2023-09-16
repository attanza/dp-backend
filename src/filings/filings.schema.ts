import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FilingDocument = HydratedDocument<Filing>;

@Schema({
  timestamps: true,
})
export class Filing {
  @Prop({ index: true })
  fileName: string;

  @Prop()
  folderName: string;

  @Prop()
  description: string;
}

export const FilingSchema = SchemaFactory.createForClass(Filing);
