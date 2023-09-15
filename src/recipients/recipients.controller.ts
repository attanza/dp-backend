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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { RecipientsService } from './recipients.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recipients')
export class RecipientsController {
  constructor(private readonly service: RecipientsService) {}

  private resource = 'Recipient';

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['asset']);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  async create(@Body() data: CreateRecipientDto) {
    await Promise.all([
      this.service.checkUserExists(data.user),
      this.service.checkCategoryExists(data.category),
    ]);

    const found = await this.service.findBy({
      user: data.user,
      category: data.category,
    });
    if (found) {
      throw new BadRequestException(`${this.resource} should be unique`);
    }
    const result = await this.service.create(data, []);

    return responseCreate(this.resource, result);
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id }, {}, {}, [
      { path: 'user', select: 'name email' },
      { path: 'category', select: 'name' },
    ]);
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.ADMIN)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateRecipientDto) {
    const found = await this.service.getById(id);
    if (data.user) {
      await this.service.checkUserExists(data.user);
    }
    if (data.category) {
      await this.service.checkCategoryExists(data.category);
    }

    const find = await this.service.findBy({
      user: data.user,
      category: data.category,
      _id: { $ne: id },
    });
    if (find) {
      throw new BadRequestException(`${this.resource} should be unique`);
    }
    const result = await this.service.update(found, data, []);

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
