import { Injectable } from '@nestjs/common';
import { Attachment, AttachmentDocument } from './attachments.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from '../shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AttachmentsService extends BaseService<AttachmentDocument> {
  constructor(
    @InjectModel(Attachment.name)
    private model: Pagination<AttachmentDocument>,
  ) {
    super(model);
  }
}
