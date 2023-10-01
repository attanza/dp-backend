import { Storage } from '@google-cloud/storage';
import { isDev } from 'src/utils/constants';

export const StorageConfig = {
  projectId: process.env.PROJECT_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  mediaBucket: process.env.STORAGE_MEDIA_BUCKET,
};

export const instantiateStorage = () => {
  if (isDev) {
    return new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });
  } else {
    return new Storage();
  }
};
