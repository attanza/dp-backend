import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRecipientBulkUserDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];
}
