import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFilingDto {
  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  folderName: string;

  @IsOptional()
  description?: string;
}
