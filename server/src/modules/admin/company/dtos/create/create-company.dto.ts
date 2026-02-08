import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyEmailDomainDto } from './company-domain.dto';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsInt()
  @IsOptional()
  parent_company_id?: number;

  @IsArray()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CompanyEmailDomainDto)
  email_domains: CompanyEmailDomainDto[];
}
