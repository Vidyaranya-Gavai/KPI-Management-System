import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateCompanyEmailDomainDto } from './update-company-domain.dto';
import { CompanyEmailDomainDto } from '../create/company-domain.dto';

export class UpdateCompanyDto {
  // Company fields
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  // Update existing domains
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCompanyEmailDomainDto)
  update_domains?: UpdateCompanyEmailDomainDto[];

  // Add new domains (creation DTO reused)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CompanyEmailDomainDto)
  new_domains?: CompanyEmailDomainDto[];
}
