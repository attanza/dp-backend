import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssetsCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
