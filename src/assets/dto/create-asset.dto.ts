import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];

  @IsOptional()
  specification: string;

  @IsOptional()
  description: string;
}
