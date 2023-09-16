import { Injectable } from '@nestjs/common';
import { Cabinet, CabinetDocument } from './cabinets.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CabinetsService extends BaseService<CabinetDocument> {
  constructor(
    @InjectModel(Cabinet.name)
    private model: Pagination<CabinetDocument>,
  ) {
    super(model);
  }
}
