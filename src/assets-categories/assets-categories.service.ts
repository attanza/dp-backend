import { Injectable } from '@nestjs/common';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  AssetCategoryDocument,
  AssetCategory,
} from './assets-categories.schema';

@Injectable()
export class AssetsCategoriesService extends BaseService<AssetCategoryDocument> {
  constructor(
    @InjectModel(AssetCategory.name)
    private model: Pagination<AssetCategoryDocument>,
  ) {
    super(model);
  }
}
