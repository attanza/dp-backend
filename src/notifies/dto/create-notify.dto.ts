import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { MaintenanceType } from '../../shared/interfaces/maintanance-type';

export class CreateNotifyDto {
  @IsNotEmpty()
  @IsMongoId()
  asset: string;

  @IsNotEmpty()
  @IsIn(Object.keys(MaintenanceType))
  type: MaintenanceType;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  lastNotify: Date;
}
