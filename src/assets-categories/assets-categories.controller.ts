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
import { AssetsCategoriesService } from './assets-categories.service';
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
import { CreateAssetsCategoryDto } from './dto/create-assets-category.dto';
import { UpdateAssetsCategoryDto } from './dto/update-assets-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets-categories')
export class AssetsCategoriesController {
  private resource = 'AssetCategory';

  constructor(private readonly service: AssetsCategoriesService) {}

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['name']);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  async create(@Body() data: CreateAssetsCategoryDto) {
    const result = await this.service.create(data, ['name']);

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
  async update(
    @Param() { id }: MongoIdPipe,
    @Body() data: UpdateAssetsCategoryDto,
  ) {
    const found = await this.service.getById(id);
    const result = await this.service.update(found, data, ['name']);
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
