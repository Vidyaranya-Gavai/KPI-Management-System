import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CompanyEmailDomainDto {
  @IsString()
  @IsNotEmpty()
  // simple but effective domain validation
  @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  domain: string;

  @IsBoolean()
  is_active?: boolean = true;
}
