import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCabinetDto {
  @IsNotEmpty()
  itemName: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsOptional()
  specificationDetail?: string;

  @IsNotEmpty()
  location: string;

  @IsOptional()
  description?: string;
}
