import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { EUserRole } from './shared/interfaces/user-role.enum';
import { CreateUserDto } from './users/dto/create-user.dto';
import { capitalCase, snakeCase } from 'change-case';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UsersService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async seed() {
    // Users
    const userData: CreateUserDto[] = [];
    const password = await hash('P@ssw0rd');

    Object.values(EUserRole).map((role: EUserRole) => {
      userData.push({
        name: capitalCase(role),
        email: `${snakeCase(role)}@gmail.com`,
        password,
        role,
      });
    });

    await Promise.all([this.userService.insertMany(userData)]);
  }
}
