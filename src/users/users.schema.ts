import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EUserRole } from '../shared/interfaces/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: EUserRole.VIEWER })
  role: EUserRole;

  @Prop()
  lastLogin: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
