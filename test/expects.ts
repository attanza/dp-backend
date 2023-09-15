export function unauthorizedExpect(expect: jest.Expect, body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(401);
  expect(body.meta.message).toEqual('Unauthorized');
}
export function forbiddenExpect(expect: jest.Expect, body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(403);
  expect(body.meta.message).toEqual('Forbidden resource');
}

export function collectionExpects(
  expect: jest.Expect,
  body: any,
  resource: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} collection`);
  expect(body.meta.hasNextPage).toBeDefined();
  expect(body.meta.hasPrevPage).toBeDefined();
  expect(body.meta.page).toBeDefined();
  expect(body.meta.limit).toBeDefined();
  expect(body.meta.totalPages).toBeDefined();
  expect(body.meta.totalDocs).toBeDefined();
  expect(body.data).toBeDefined();
  expect(Array.isArray(body.data)).toBeTruthy();
}

export function validationFailedExpect(
  expect: jest.Expect,
  body: any,
  errMessage: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(400);
  expect(Array.isArray(body.meta.message)).toBeTruthy();
  expect(body.meta.message.includes(errMessage)).toBeTruthy();
}

export function validationFailedItemNotExistsExpect(
  expect: jest.Expect,
  body: any,
  errMessage: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(422);
  expect(body.meta.message === errMessage).toBeTruthy();
}

export function unprocessableEntityExpect(
  expect: jest.Expect,
  body: any,
  errMessage: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(422);
  expect(body.meta.message).toEqual(errMessage);
}

export function createExpect(
  expect: jest.Expect,
  body: any,
  resource: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(201);
  expect(body.meta.message).toEqual(`${resource} created`);
  expect(body.data).toBeDefined();
}

export function duplicateErrorExpect(expect: jest.Expect, body: any): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(400);
  expect(body.meta.message).toMatch(/should be unique/);
}

export function showExpect(
  expect: jest.Expect,
  body: any,
  resource: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} detail`);
  expect(body.data).toBeDefined();
}

export function updateExpect(
  expect: jest.Expect,
  body: any,
  resource: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} updated`);
  expect(body.data).toBeDefined();
}

export function deleteExpect(
  expect: jest.Expect,
  body: any,
  resource: string,
): void {
  expect(body.meta).toBeDefined();
  expect(body.meta.status).toEqual(200);
  expect(body.meta.message).toEqual(`${resource} deleted`);
}
