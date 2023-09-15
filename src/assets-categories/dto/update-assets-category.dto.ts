import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetsCategoryDto } from './create-assets-category.dto';

export class UpdateAssetsCategoryDto extends PartialType(CreateAssetsCategoryDto) {}
