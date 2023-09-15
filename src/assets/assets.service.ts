import { Injectable } from '@nestjs/common';
import { Asset, AssetDocument } from './assets.schema';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from 'src/shared/services/base.service';
import { AssetsCategoriesService } from 'src/assets-categories/assets-categories.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AssetsService extends BaseService<AssetDocument> {
  constructor(
    @InjectModel(Asset.name)
    private model: Pagination<AssetDocument>,
    private readonly assetCategory: AssetsCategoriesService,
  ) {
    super(model);
  }

  async checkAssetCategoryExists(ids: string[]): Promise<void> {
    await this.assetCategory.shouldExists(ids);
  }
}
