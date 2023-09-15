import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { responseDetail, responseSuccess } from 'src/utils/response-parser';
import { RegisterDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req) {
    await this.authService.resetPassword(dto, req.user._id);
    return responseSuccess('Password updated', undefined);
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() data: RegisterDto) {
    await this.authService.register(data);
    return responseSuccess('Register Succeed', undefined);
  }
}
