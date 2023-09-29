import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EUserRole } from '../shared/interfaces/user-role.enum';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret['password'];
      return ret;
    },
  },
})
export class User {
  @Prop()
  name: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: EUserRole.VIEWER })
  role: EUserRole;

  @Prop()
  lastLogin: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
