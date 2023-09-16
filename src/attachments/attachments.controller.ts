import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
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
import { StorageService } from '../storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { fileValidator } from 'src/utils/file-validator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly service: AttachmentsService,
    private storageService: StorageService,
  ) {}

  private resource = 'Attachment';

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['name', 'resource']);
    return responseCollection(this.resource, result);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateAttachmentDto,
  ) {
    fileValidator(file);
    const path =
      data.resource + '/' + data.resourceId + '_' + file.originalname;

    data.link = path.toLocaleLowerCase();
    const result = await this.service.create(data, ['name']);
    await this.storageService.save(
      path.toLocaleLowerCase(),
      file.mimetype,
      file.buffer,
      [{ [data.resource]: data.resourceId }],
    );
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
    @Body() data: UpdateAttachmentDto,
  ) {
    const found = await this.service.getById(id);

    const result = await this.service.update(found, data, ['name']);

    return responseUpdate(this.resource, result);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  async destroy(@Param() { id }: MongoIdPipe) {
    const found = await this.service.getById(id);
    await Promise.all([
      this.storageService.delete(found.link),
      this.service.delete(found),
    ]);
    return responseDelete(this.resource);
  }
}
