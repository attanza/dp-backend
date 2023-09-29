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
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, []);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.EDITOR)
  async create(@Body() data: CreateRecipientDto) {
    await Promise.all([
      this.service.checkUserExists(data.users),
      this.service.checkCategoryExists(data.categories),
    ]);
    await this.service.saveMany(data.users, data.categories);

    return responseCreate(this.resource, undefined);
  }

  @Get(':id')
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.findOrFail({ _id: id }, {}, {}, [
      { path: 'user', select: 'name email' },
      { path: 'category', select: 'name' },
    ]);
    return responseDetail(this.resource, result);
  }

  @Put(':id')
  @Roles(EUserRole.EDITOR)
  async update(@Param() { id }: MongoIdPipe, @Body() data: UpdateRecipientDto) {
    const found = await this.service.getById(id);
    if (data.users) {
      await this.service.checkUserExists(data.users);
    }
    if (data.categories) {
      await this.service.checkCategoryExists(data.categories);
    }

    // const find = await this.service.findBy({
    //   user: data.user,
    //   category: data.category,
    //   _id: { $ne: id },
    // });
    // if (find) {
    //   throw new BadRequestException(`${this.resource} should be unique`);
    // }
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
