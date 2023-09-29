import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRecipientBulkDto {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  users: string[];

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];
}
