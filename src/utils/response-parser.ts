export const responseCollection = (resource: string, data: any) => {
  const pagination = { ...data };
  delete pagination['docs'];
  return {
    meta: {
      status: 200,
      message: `${resource} collection`,
      ...pagination,
    },
    data: data?.docs || null,
  };
};

export const responseSuccess = (message: string, data: any) => {
  return {
    meta: {
      status: 200,
      message,
    },
    data,
  };
};
export const responseDetail = (resource: string, data: any) => {
  return {
    meta: {
      status: 200,
      message: `${resource} detail`,
    },
    data,
  };
};

export const responseCreate = (resource: string, data: any) => {
  return {
    meta: {
      status: 201,
      message: `${resource} created`,
    },
    data,
  };
};

export const responseUpdate = (resource: string, data: any) => {
  return {
    meta: {
      status: 200,
      message: `${resource} updated`,
    },
    data,
  };
};

export const responseDelete = (resource: string) => {
  return {
    meta: {
      status: 200,
      message: `${resource} deleted`,
    },
  };
};
