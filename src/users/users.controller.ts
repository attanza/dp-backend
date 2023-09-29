import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoIdPipe } from '../shared/pipes/mongoId.pipe';
import { ResourcePaginationPipe } from 'src/shared/pipes/resource-pagination.pipe';
import {
  responseCollection,
  responseCreate,
  responseDetail,
  responseUpdate,
  responseDelete,
} from '../utils/response-parser';
import { Redis } from '../utils/redis';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/guards/roles.decorator';
import { EUserRole } from '../shared/interfaces/user-role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private resource = 'User';
  constructor(private readonly service: UsersService) {}

  @Get()
  async paginate(@Query() query: ResourcePaginationPipe) {
    query.select = '-password';
    const result = await this.service.paginate(query, [
      'name',
      'email',
      'role',
    ]);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.EDITOR)
  async create(@Body() data: CreateUserDto) {
    const result = await this.service.create(data, ['email']);

    return responseCreate(this.resource, result);
  }

  @Get(':id')
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id });
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.EDITOR)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateUserDto) {
    const found = await this.service.getById(id);
    const result = await this.service.update(found, data, ['email']);

    await Redis.del(`Authorized_${id}`);
    return responseUpdate(this.resource, result);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  async destroy(@Param() { id }: MongoIdPipe) {
    const found = await this.service.getById(id);
    await this.service.delete(found);

    await Redis.del(`Authorized_${id}`);
    return responseDelete(this.resource);
  }
}
