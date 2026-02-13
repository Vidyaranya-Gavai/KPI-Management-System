import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(RoleType)
  type: RoleType;
}
