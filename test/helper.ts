import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { EUserRole } from '../src/shared/interfaces/user-role.enum';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UserDocument, User } from '../src/users/users.schema';
import Chance from 'chance';
export const TEST_DB_URL = 'mongodb://localhost/dana_paint_dev';

export const faker: Chance = new Chance();
export const APP_URL = 'http://localhost:10000';

export const generateToken = async (user: UserDocument) => {
  const token = await jwt.sign(
    { uid: user._id, lastLogin: user.lastLogin },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );
  return token;
};

export const createUsers = async (userModel: mongoose.Model<User>) => {
  const userData: CreateUserDto[] = [];
  Object.values(EUserRole).map((role: EUserRole) => {
    userData.push({
      name: faker.name(),
      email: faker.email(),
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$BKuM18FRgCGLNJdPItwvpA$HoeEO7wnFeyKt66RyYLsscbpScmxzDKKH88jWvw9aWg',
      role,
    });
  });
  await userModel.insertMany(userData);
};

export const getUser = async (
  userModel: mongoose.Model<User>,
  role: EUserRole,
) => {
  const user = await userModel.findOne({ role }).exec();
  return user;
};

export const generateTokenByRole = async (
  userModel: mongoose.Model<User>,
  role: EUserRole,
) => {
  const user = await getUser(userModel, role);
  const token = await generateToken(user);
  return token;
};
