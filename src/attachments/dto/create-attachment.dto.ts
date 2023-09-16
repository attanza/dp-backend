import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EResources } from '../../shared/interfaces/resource.enum';

export class CreateAttachmentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsIn(Object.values(EResources))
  resource: string;

  @IsNotEmpty()
  @IsMongoId()
  resourceId: string;

  @IsOptional()
  @IsArray()
  link?: string;

  @IsOptional()
  description?: string;
}
