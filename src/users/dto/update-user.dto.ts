import { IsBoolean, IsEmail, IsIn, IsOptional } from 'class-validator';
import { EUserRole } from 'src/shared/interfaces/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(Object.values(EUserRole))
  role?: EUserRole;

  @IsOptional()
  @IsBoolean()
  isActive: true;
}
