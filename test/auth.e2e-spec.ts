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
describe(`${resource} Login`, () => {
  it('cannot login if wrong credentials', () => {
    return request(APP_URL)
      .post(URL + '/login')
      .send({
        email: 'test@gmail.com',
        password: 'password',
      })
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });
  it('can login with correct credentials', () => {
    return request(APP_URL)
      .post(URL + '/login')
      .send({
        email: 'admin@gmail.com',
        password: 'P@ssw0rd',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(200);
        expect(body.meta.message).toEqual(`Login success`);
        expect(body.data).toBeDefined();
        expect(body.data.token).toBeDefined();
      });
  });
});
describe(`${resource} Me`, () => {
  it('cannot get me if not authenticated', () => {
    return request(APP_URL)
      .get(URL + '/me')
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });
  it('can get me if authenticated', () => {
    return request(APP_URL)
      .get(URL + '/me')
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(200)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(200);
        expect(body.meta.message).toEqual(`Me detail`);
        expect(body.data).toBeDefined();
      });
  });
});
