import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { FilingsService } from './filings.service';
import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('filings')
export class FilingsController {
  constructor(private readonly service: FilingsService) {}

  private resource = 'Filing';

  @Get()
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, [
      'fileName',
      'folderName',
    ]);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.EDITOR)
  async create(@Body() data: CreateFilingDto) {
    const result = await this.service.create(data, ['fileName']);

    return responseCreate(this.resource, result);
  }

  @Get(':id')
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id });
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.EDITOR)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateFilingDto) {
    const found = await this.service.getById(id);
    const result = await this.service.update(found, data, ['fileName']);
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
