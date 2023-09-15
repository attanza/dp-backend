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
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from '../shared/guards/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  private resource = 'Asset';

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['name', 'serialNumber']);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  async create(@Body() data: CreateAssetDto) {
    if (data.categories) {
      await this.service.checkAssetCategoryExists(data.categories);
    }
    const result = await this.service.create(data, ['name', 'serialNumber']);

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
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateAssetDto) {
    const found = await this.service.getById(id);
    if (data.categories) {
      await this.service.checkAssetCategoryExists(data.categories);
    }
    const result = await this.service.update(found, data, [
      'name',
      'serialNumber',
    ]);

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
