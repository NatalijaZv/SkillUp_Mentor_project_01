import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { Match } from 'decorators/match.decorator'

export class RegisterUserDto {
  @IsOptional()
  first_name?: string

  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must contain at least one number, lower or uppercase letter and it hat to be longer than 5 characters.',
  })
  password: string

  @IsNotEmpty()
  @Match(RegisterUserDto, (s) => s.password, { message: 'Passwords do not match' }) //custom decorator
  confirm_password: string
}
