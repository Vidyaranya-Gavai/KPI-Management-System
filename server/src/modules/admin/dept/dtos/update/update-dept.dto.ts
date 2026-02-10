import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DeptType } from '../enums/dept-type.enum';

export class UpdateDeptDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(DeptType)
  type?: DeptType;
}
