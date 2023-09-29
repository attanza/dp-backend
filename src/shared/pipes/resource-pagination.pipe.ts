import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ESortMode {
  asc = 'asc',
  desc = 'desc',
}

export class ResourcePaginationPipe {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  perPage: number;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  projection: string;

  @IsOptional()
  select: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsIn([ESortMode.asc, ESortMode.desc])
  sortMode: ESortMode;

  @IsOptional()
  fieldKey: string;

  @IsOptional()
  fieldValue: any;

  @IsOptional()
  fieldInKey: string;

  @IsOptional()
  fieldInValue: any;

  @IsOptional()
  regexKey: any;

  @IsOptional()
  regexValue: any;

  @IsOptional()
  populate: any;

  // @IsOptional()
  // @IsLatitude()
  // latitude: number;

  // @IsOptional()
  // @IsLongitude()
  // longitude: string;

  // @IsOptional()
  // @IsString()
  // role: string;

  // @IsOptional()
  // @IsBooleanString()
  // showAll: boolean;

  @IsOptional()
  @IsString()
  dateRangeField: string;

  @IsOptional()
  @IsDateString()
  startDateRange: Date;

  @IsOptional()
  @IsDateString()
  endDateRange: Date;
}
