import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BootstrapParentCompanyDto } from './bootstrap-parent-company.dto';
import { BootstrapChildCompanyDto } from './bootstrap-child-company.dto';

export class BootstrapCompanyDto {
  @ValidateNested()
  @Type(() => BootstrapParentCompanyDto)
  parent: BootstrapParentCompanyDto;

  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => BootstrapChildCompanyDto)
  children: BootstrapChildCompanyDto[];
}
