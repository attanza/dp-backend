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

  async checkUserExist(id: string): Promise<void> {
    await this.userService.findOrFail({ _id: id });
  }
  async checkUserExists(ids: string[]): Promise<void> {
    await this.userService.shouldExists(ids);
  }

  async checkCategoryExist(id: string): Promise<void> {
    await this.categoryService.findOrFail({ _id: id });
  }

  async checkCategoryExists(ids: string[]): Promise<void> {
    await this.categoryService.shouldExists(ids);
  }
  async saveMany(users: string[], categories: string[]) {
    const postData = [];
    users.forEach((user) => {
      categories.forEach((category) => {
        postData.push({
          user,
          category,
        });
      });
    });
    this.insertMany(postData);
  }
}
