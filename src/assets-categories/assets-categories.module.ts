import { Module } from '@nestjs/common';
import { AssetsCategoriesService } from './assets-categories.service';
import { AssetsCategoriesController } from './assets-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetCategory, AssetCategorySchema } from './assets-categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetCategory.name, schema: AssetCategorySchema },
    ]),
  ],
  controllers: [AssetsCategoriesController],
  providers: [AssetsCategoriesService],
  exports: [AssetsCategoriesService],
})
export class AssetsCategoriesModule {}
