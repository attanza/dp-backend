import { BadRequestException } from '@nestjs/common';

const ALLOWED_FILE_SIZE = 10000000;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/bmp',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'application/pdf',
  'text/csv',
  'text/plain',
  'application/zip',
];

export const fileValidator = (file: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestException('file is required');
  }

  if (file.size > ALLOWED_FILE_SIZE) {
    throw new BadRequestException('file size is not allowed');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException('file extension is not allowed');
  }
};
