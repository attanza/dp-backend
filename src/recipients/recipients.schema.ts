import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../users/users.schema';
import { AssetCategory } from '../assets-categories/assets-categories.schema';

export type RecipientDocument = HydratedDocument<Recipient>;

@Schema({
  timestamps: true,
})
export class Recipient {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AssetCategory' })
  category: AssetCategory;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);
