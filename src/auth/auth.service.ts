import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { responseSuccess } from 'src/utils/response-parser';
import moment from 'moment';
import { RegisterDto, ResetPasswordDto } from './auth.dto';
import { Redis } from 'src/utils/redis';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: UserDocument = await this.userService.findOne<UserDocument>({
      email: username,
    });

    if (!user) {
      console.log('no user');

      return null;
    }
    const isVerified = await bcrypt.compare(pass, user.password);

    if (!isVerified) {
      console.log('not verified');
      return null;
    }
    if (!user.isActive) {
      console.log('not active');
      return null;
    }
    user.lastLogin = moment().unix();
    await Promise.all([user.save(), Redis.set(`Authorized_${user._id}`, user)]);

    return user;
  }

  async login(user: UserDocument) {
    const payload = { uid: user._id, lastLogin: user.lastLogin };

    return responseSuccess('Login success', {
      token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: process.env.GCS_LINK + user.avatar,
      },
    });
  }

  async register(data: RegisterDto) {
    await this.userService.shouldUnique(data, ['email']);
    await this.userService.create(data);
  }

  async resetPassword(dto: ResetPasswordDto, id: string) {
    const user = await this.userService.findById<UserDocument>(id);
    const { oldPassword, newPassword } = dto;
    const isVerified = await bcrypt.compare(oldPassword, user.password);
    if (!isVerified) {
      this.logger.log('wrong old password');
      throw new BadRequestException('Change password failed');
    }
    user.password = newPassword;
    await user.save();
  }

  async editUser(userId: string, data: any) {
    const found = await this.userService.getById(userId);
    return this.userService.update(found, data);
  }
}
