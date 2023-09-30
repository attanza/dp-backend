import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { responseDetail, responseSuccess } from 'src/utils/response-parser';
import { ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extension } from 'mime-types';
@Controller('auth')
export class AuthController {
  ALLOWED_FILE_SIZE = 5000000;
  ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/bmp',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/bmp',
  ];
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return responseDetail('Me', req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req) {
    await this.authService.resetPassword(dto, req.user._id);

    return responseSuccess('Password updated', undefined);
  }

  @Post('upload-avatar')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    if (file.size > this.ALLOWED_FILE_SIZE) {
      throw new BadRequestException('file size is not allowed');
    }
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('file extension is not allowed');
    }
    const fileExtension = extension(file.mimetype);

    const fileName = `user/${req.user._id}_avatar.${fileExtension}`;
    const user = await this.authService.editUser(req.user, {
      avatar: fileName,
    });
    await this.storageService.save(fileName, file.mimetype, file.buffer, [
      { userId: req.user._id },
    ]);
    return responseSuccess('Profile', user);
  }

  // @Post('register')
  // @HttpCode(200)
  // async register(@Body() data: RegisterDto) {
  //   await this.authService.register(data);
  //   return responseSuccess('Register Succeed', undefined);
  // }
}
