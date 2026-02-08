import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyEmailDomainDto } from './company-domain.dto';
import { IBootstrapCompany } from '../interfaces/bootstrap-company.interface';

export class BootstrapParentCompanyDto implements IBootstrapCompany {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  is_active?: boolean = true;

  @IsArray()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CompanyEmailDomainDto)
  email_domains: CompanyEmailDomainDto[];
}
