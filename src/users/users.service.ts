import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) private model: Pagination<UserDocument>) {
    super(model);
  }
}
