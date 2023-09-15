import { Injectable } from '@nestjs/common';
import { Recipient, RecipientDocument } from './recipients.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from '../shared/services/base.service';
import { UsersService } from '../users/users.service';
import { AssetsCategoriesService } from 'src/assets-categories/assets-categories.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RecipientsService extends BaseService<RecipientDocument> {
  constructor(
    @InjectModel(Recipient.name)
    private model: Pagination<Recipient>,
    private userService: UsersService,
    private categoryService: AssetsCategoriesService,
  ) {
    super(model);
  }

  async checkUserExists(id: string): Promise<void> {
    await this.userService.getById(id);
  }

  async checkCategoryExists(id: string): Promise<void> {
    await this.categoryService.getById(id);
  }
}
