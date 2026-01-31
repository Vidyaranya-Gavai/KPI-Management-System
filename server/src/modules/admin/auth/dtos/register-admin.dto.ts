import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterAdminDto {
  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  password: string;

  @IsEmail()
  recovery_email: string;
}
