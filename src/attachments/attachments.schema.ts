import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AttachmentDocument = HydratedDocument<Attachment>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      if (ret['link'] && ret['link'] !== '') {
        ret['link'] = process.env.GCS_LINK + ret['link'];
      }
      return ret;
    },
  },
})
export class Attachment {
  @Prop()
  name: string;

  @Prop()
  resource: string;

  @Prop()
  resourceId: string;

  @Prop()
  link: string;

  @Prop()
  description: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
