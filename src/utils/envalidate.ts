import { cleanEnv, port, str } from 'envalid';

export const envalidate = () => {
  return cleanEnv(process.env, {
    DB_URL: str(),
    NODE_ENV: str({
      choices: ['development', 'test', 'production', 'staging'],
    }),
    PORT: port(),
    REDIS_URL: str(),
    REDIS_PASSWORD: str(),
    JWT_SECRET: str(),
    PROJECT_ID: str(),
    PRIVATE_KEY: str(),
    CLIENT_EMAIL: str(),
    STORAGE_MEDIA_BUCKET: str(),
    GCS_LINK: str(),
  });
};
