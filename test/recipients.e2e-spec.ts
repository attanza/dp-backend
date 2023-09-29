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

import {
  Recipient,
  RecipientSchema,
} from '../src/recipients/recipients.schema';
import { CreateRecipientDto } from '../src/recipients/dto/create-recipient.dto';
import {
  AssetCategory,
  AssetCategorySchema,
} from '../src/assets-categories/assets-categories.schema';
import { User, UserSchema } from '../src/users/users.schema';
const resource = 'Recipient';
const URL = '/recipients';
let userModel: mongoose.Model<User>;
let recipientModel: mongoose.Model<Recipient>;
let categoryModel: mongoose.Model<AssetCategory>;

let adminToken;
let viewerToken;
let found;
let user;
let category;
let otherCategory;
// let otherUser;

const createData: CreateRecipientDto = {
  user: '',
  category: '',
  description: '',
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);
  userModel = mongoose.model('User', UserSchema);
  adminToken = await generateTokenByRole(userModel, EUserRole.ADMIN);
  viewerToken = await generateTokenByRole(userModel, EUserRole.VIEWER);
  recipientModel = mongoose.model('Recipient', RecipientSchema);
  categoryModel = mongoose.model('AssetCategory', AssetCategorySchema);
  user = await userModel.findOne();
  // otherUser = await userModel.create({ role: EUserRole.EDITOR });
  category = await categoryModel.findOne();
  otherCategory = await categoryModel.create({ name: faker.name() });
  createData.user = user._id.toString();
  createData.category = category._id.toString();
});
afterAll(async () => {
  await recipientModel.deleteOne({ user: user._id });
  await categoryModel.deleteOne({ _id: otherCategory._id });

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

describe(`${resource} Create`, () => {
  it('cannot create if not authenticated', () => {
    return request(APP_URL)
      .post(URL)
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });
  it('cannot create list if unauthorized', () => {
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${viewerToken}` })
      .expect(403)
      .expect(({ body }) => {
        forbiddenExpect(expect, body);
      });
  });

  it('cannot create if validation failed', () => {
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        const errMessage = `user should not be empty`;
        validationFailedExpect(expect, body, errMessage);
      });
  });
  it('cannot create if user not exists', () => {
    const postData = {
      ...createData,
      user: '62b9b69c41819e19ac9aa569',
    };
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(postData)
      .expect(400)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(400);
        expect(body.meta.message).toEqual(`User not found`);
      });
  });

  it('can create', () => {
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(createData)
      .expect(201)
      .expect(({ body }) => {
        createExpect(expect, body, resource);
        const output = { ...body };
        const dataToCheck = {
          ...createData,
        };
        Object.keys(dataToCheck).map((key) => {
          expect(output.data[key]).toEqual(dataToCheck[key]);
        });
      });
  });

  it('cannot create if duplicate', () => {
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(createData)
      .expect(400)
      .expect(({ body }) => {
        duplicateErrorExpect(expect, body);
      });
  });
  it('can create if deferent category', () => {
    const postData = { ...createData, category: otherCategory._id.toString() };
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(postData)
      .expect(201)
      .expect(({ body }) => {
        createExpect(expect, body, resource);
        const output = { ...body };

        Object.keys(postData).map((key) => {
          expect(output.data[key]).toEqual(postData[key]);
        });
      });
  });
});
describe(`${resource} Detail`, () => {
  it('cannot get detail if not authenticated', async () => {
    found = await recipientModel.findOne({ user: createData.user });
    return request(APP_URL)
      .get(`${URL}/${found._id}`)
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });
  // it('cannot get detail list if unauthorized', () => {
  //   return request(APP_URL)
  //     .get(`${URL}/${found._id}`)
  //     .set({ Authorization: `Bearer ${viewerToken}` })
  //     .expect(403)
  //     .expect(({ body }) => {
  //       forbiddenExpect(expect, body);
  //     });
  // });

  it('cannot get detail if invalid mongo id', () => {
    return request(APP_URL)
      .get(`${URL}/sfgdfg`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        const errMessage = 'id must be a mongodb id';
        validationFailedExpect(expect, body, errMessage);
      });
  });
  it('cannot get detail if not exists', () => {
    return request(APP_URL)
      .get(`${URL}/62b9b69c41819e19ac9aa569`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(400);
        expect(body.meta.message).toEqual(`${resource} not found`);
      });
  });
  it('can get detail', () => {
    return request(APP_URL)
      .get(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(200)
      .expect(({ body }) => {
        showExpect(expect, body, resource);
        const output = { ...body.data };
        Object.keys(createData).map((key) => {
          expect(output[key]).toEqual(createData[key]);
        });
        // expect(body.data.user._id).toEqual(user._id.toString());
        // expect(body.data.user.email).toEqual(user.email);
        // expect(body.data.category._id).toEqual(category._id.toString());
        // expect(body.data.category.name).toEqual(category.name);
      });
  });
});
describe(`${resource} Update`, () => {
  it('cannot update if not authenticated', () => {
    return request(APP_URL)
      .put(`${URL}/${found._id}`)
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });

  it('cannot update if unauthorized', () => {
    return request(APP_URL)
      .put(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${viewerToken}` })
      .expect(403)
      .expect(({ body }) => {
        forbiddenExpect(expect, body);
      });
  });

  it('cannot update if invalid mongo id', () => {
    return request(APP_URL)
      .put(`${URL}/sfgdfg`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        const errMessage = 'id must be a mongodb id';
        validationFailedExpect(expect, body, errMessage);
      });
  });
  it('cannot update if not exists', () => {
    return request(APP_URL)
      .put(`${URL}/5f091216ae2a140e064d2326`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(400);
        expect(body.meta.message).toEqual(`${resource} not found`);
      });
  });
  it('can update', async () => {
    const updatedData = { ...createData };
    updatedData.description = faker.sentence();

    return request(APP_URL)
      .put(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(updatedData)
      .expect(200)
      .expect(({ body }) => {
        updateExpect(expect, body, resource);
        const output = { ...body };
        const dataToCheck = {
          ...createData,
          description: updatedData.description,
        };
        Object.keys(dataToCheck).map((key) => {
          expect(output.data[key]).toEqual(dataToCheck[key]);
        });
      });
  });
});

describe(`${resource} Delete`, () => {
  it('cannot delete if not authenticated', () => {
    return request(APP_URL)
      .delete(`${URL}/${found._id}`)
      .expect(401)
      .expect(({ body }) => {
        unauthorizedExpect(expect, body);
      });
  });

  it('cannot delete if unauthorized', () => {
    return request(APP_URL)
      .delete(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${viewerToken}` })
      .expect(403)
      .expect(({ body }) => {
        forbiddenExpect(expect, body);
      });
  });

  it('cannot delete if invalid mongo id', () => {
    return request(APP_URL)
      .delete(`${URL}/sfgdfg`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        const errMessage = 'id must be a mongodb id';
        validationFailedExpect(expect, body, errMessage);
      });
  });
  it('cannot delete if not exists', () => {
    return request(APP_URL)
      .delete(`${URL}/5f091216ae2a140e064d2326`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(400)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(400);
        expect(body.meta.message).toEqual(`${resource} not found`);
      });
  });
  it('can delete', async () => {
    return request(APP_URL)
      .delete(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(200)
      .expect(({ body }) => {
        deleteExpect(expect, body, resource);
      });
  });
});
