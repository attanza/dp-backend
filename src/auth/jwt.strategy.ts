import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Redis } from '../utils/redis';
import { User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { uid, lastLogin } = payload;
    const redisKey = `Authorized_${uid}`;
    let user;
    const cache = await Redis.get<User>(redisKey);
    if (cache) {
      user = cache;
    } else {
      user = await this.userService.findById<User>(uid);
      await Redis.set(redisKey, user);
    }
    // if (user.lastLogin !== lastLogin) {
    //   console.log('last login not matched');

    //   return null;
    // }

    return user;
  }
}
