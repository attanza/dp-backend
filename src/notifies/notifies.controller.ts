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
  BadRequestException,
} from '@nestjs/common';
import { NotifiesService } from './notifies.service';
import { Roles } from '../shared/guards/roles.decorator';
import { EUserRole } from '../shared/interfaces/user-role.enum';
import { MongoIdPipe } from '../shared/pipes/mongoId.pipe';
import { ResourcePaginationPipe } from '../shared/pipes/resource-pagination.pipe';
import { Redis } from '../utils/redis';
import {
  responseCollection,
  responseCreate,
  responseDetail,
  responseUpdate,
  responseDelete,
} from '../utils/response-parser';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotifiesController {
  constructor(private readonly service: NotifiesService) {}

  private resource = 'Notification';

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['asset']);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  async create(@Body() data: CreateNotifyDto) {
    await this.service.checkAssetExists(data.asset);
    const find = await this.service.findBy({
      asset: data.asset,
      type: data.type,
    });
    if (find) {
      throw new BadRequestException(`${this.resource} should be unique`);
    }
    const postData = this.service.fillNextNotify(data);
    const result = await this.service.create(postData, []);

    return responseCreate(this.resource, result);
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id });
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.ADMIN)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateNotifyDto) {
    const found = await this.service.getById(id);
    await this.service.checkAssetExists(data.asset);
    const find = await this.service.findBy({
      asset: data.asset,
      type: data.type,
      _id: { $ne: id },
    });
    if (find) {
      throw new BadRequestException(`${this.resource} should be unique`);
    }
    const postData = this.service.fillNextNotify(data);
    const result = await this.service.update(found, postData, []);

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
