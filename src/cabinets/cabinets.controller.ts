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
import { CabinetsService } from './cabinets.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { Roles } from '../shared/guards/roles.decorator';
import { EUserRole } from '../shared/interfaces/user-role.enum';
import { MongoIdPipe } from '../shared/pipes/mongoId.pipe';
import { ResourcePaginationPipe } from '../shared/pipes/resource-pagination.pipe';
import {
  responseCollection,
  responseCreate,
  responseDetail,
  responseUpdate,
  responseDelete,
} from '../utils/response-parser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cabinets')
export class CabinetsController {
  constructor(private readonly service: CabinetsService) {}

  private resource = 'Cabinet';

  @Get()
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, [
      'itemName',
      'serialNumber',
      'location',
    ]);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.EDITOR)
  async create(@Body() data: CreateCabinetDto) {
    const result = await this.service.create(data, [
      'itemName',
      'serialNumber',
    ]);

    return responseCreate(this.resource, result);
  }

  @Get(':id')
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id });
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.EDITOR)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateCabinetDto) {
    const found = await this.service.getById(id);
    const result = await this.service.update(found, data, [
      'itemName',
      'serialNumber',
    ]);
    return responseUpdate(this.resource, result);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  async destroy(@Param() { id }: MongoIdPipe) {
    const found = await this.service.getById(id);
    await this.service.delete(found);
    return responseDelete(this.resource);
  }
}
