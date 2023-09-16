import { PartialType } from '@nestjs/mapped-types';
import { CreateFilingDto } from './create-filing.dto';

export class UpdateFilingDto extends PartialType(CreateFilingDto) {}
