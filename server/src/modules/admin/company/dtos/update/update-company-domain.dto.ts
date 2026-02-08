import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateCompanyEmailDomainDto {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  domain?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
