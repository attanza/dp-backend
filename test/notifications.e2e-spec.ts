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
import { User, UserSchema } from '../src/users/users.schema';

import { Asset, AssetSchema } from '../src/assets/assets.schema';
import { Notify, NotifySchema } from '../src/notifies/notifies.schema';
import { CreateNotifyDto } from '../src/notifies/dto/create-notify.dto';
import { MaintenanceType } from '../src/shared/interfaces/maintanance-type';
const resource = 'Notification';
const URL = '/notifications';
let userModel: mongoose.Model<User>;
let notifyModel: mongoose.Model<Notify>;
let assetModel: mongoose.Model<Asset>;

let adminToken;
let viewerToken;
let found;
let asset;

const createData: CreateNotifyDto = {
  asset: '',
  description: faker.sentence(),
  type: MaintenanceType.WEEKLY,
  lastNotify: faker.date({ year: 2023 }),
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);
  userModel = mongoose.model('User', UserSchema);
  adminToken = await generateTokenByRole(userModel, EUserRole.ADMIN);
  viewerToken = await generateTokenByRole(userModel, EUserRole.VIEWER);
  notifyModel = mongoose.model('Notify', NotifySchema);
  assetModel = mongoose.model('Asset', AssetSchema);
  asset = await assetModel.findOne();
  createData.asset = asset._id.toString();
});
afterAll(async () => {
  await assetModel.deleteOne({ asset: asset._id });
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
        const errMessage = `asset should not be empty`;
        validationFailedExpect(expect, body, errMessage);
      });
  });
  it('cannot create if asset asset not exists', () => {
    const postData = {
      ...createData,
      asset: '62b9b69c41819e19ac9aa569',
    };
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(postData)
      .expect(400)
      .expect(({ body }) => {
        expect(body.meta).toBeDefined();
        expect(body.meta.status).toEqual(400);
        expect(body.meta.message).toEqual(`Asset not found`);
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
          lastNotify: createData.lastNotify.toISOString(),
        };
        Object.keys(dataToCheck).map((key) => {
          expect(output.data[key]).toEqual(dataToCheck[key]);
        });
        expect(output.data.nextNotify).toBeDefined();
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
  it('can create if defrent type', () => {
    const postData = { ...createData, type: MaintenanceType.WEEKLY };
    return request(APP_URL)
      .post(URL)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(postData)
      .expect(400)
      .expect(({ body }) => {
        duplicateErrorExpect(expect, body);
      });
  });
});
describe(`${resource} Detail`, () => {
  it('cannot get detail if not authenticated', async () => {
    found = await notifyModel.findOne({ asset: createData.asset });

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
        expect(body.meta.message).toEqual(`Notify not found`);
      });
  });
  it('can get detail', () => {
    return request(APP_URL)
      .get(`${URL}/${found._id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .expect(200)
      .expect(({ body }) => {
        showExpect(expect, body, resource);
        const output = { ...body };
        const dataToCheck = {
          ...createData,
          lastNotify: createData.lastNotify.toISOString(),
        };
        Object.keys(dataToCheck).map((key) => {
          expect(output.data[key]).toEqual(dataToCheck[key]);
        });
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
        expect(body.meta.message).toEqual(`Notify not found`);
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
          lastNotify: createData.lastNotify.toISOString(),
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
        expect(body.meta.message).toEqual(`Notify not found`);
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
