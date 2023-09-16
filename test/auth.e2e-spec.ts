import 'dotenv/config';
import mongoose from 'mongoose';
import request from 'supertest';
import { EUserRole } from '../src/shared/interfaces/user-role.enum';
import {
  collectionExpects,
  createExpect,
  deleteExpect,
  duplicateErrorExpect,
  forbiddenExpect,
  showExpect,
  unauthorizedExpect,
  updateExpect,
  validationFailedExpect,
} from './expects';
import { APP_URL, faker, generateTokenByRole } from './helper';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { User, UserSchema } from '../src/users/users.schema';
const resource = 'Auth';
const URL = '/auth';
let userModel: mongoose.Model<User>;
let adminToken;
let viewerToken;
let found;

const createData: CreateUserDto = {
  name: faker.name(),
  email: faker.email(),
  password: 'password',
  role: EUserRole.VIEWER,
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);
  userModel = mongoose.model('User', UserSchema);
  adminToken = await generateTokenByRole(userModel, EUserRole.ADMIN);
  viewerToken = await generateTokenByRole(userModel, EUserRole.VIEWER);
});
afterAll(async () => {
  await mongoose.disconnect();
});
describe(`${resource} List`, () => {
  it('cannot get list if unauthenticated', () => {
    return request(APP_URL)
      .get(URL)
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });
  // it('cannot get list if unauthorized', () => {
  //   return request(APP_URL)
  //     .get(URL)
  //     .set({ Authorization: `Bearer ${viewerToken}` })
  //     .expect(403)
  //     .expect(({ body }) => {
  //       forbiddenExpect(expect, body);
  //     });
  // });
  it('can get list', () => {
    return request(APP_URL)
      .get(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(200)
      .expect(({ body }) => {
        collectionExpects(expect, body, resource);
      });
  });
});
