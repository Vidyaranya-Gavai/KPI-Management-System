import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DeptType } from '../enums/dept-type.enum';

export class CreateDeptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(DeptType)
  type: DeptType;
}
