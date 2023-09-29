import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecipientDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsOptional()
  description?: string;
}
