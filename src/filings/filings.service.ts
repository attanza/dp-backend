import { Injectable } from '@nestjs/common';
import { Filing, FilingDocument } from './filings.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from '../shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FilingsService extends BaseService<FilingDocument> {
  constructor(
    @InjectModel(Filing.name)
    private model: Pagination<FilingDocument>,
  ) {
    super(model);
  }
}
