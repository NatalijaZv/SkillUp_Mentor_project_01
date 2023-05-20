import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator'
import { Match } from 'decorators/match.decorator'

export class UpdateUserDto {
  @IsOptional()
  first_name?: string

  @IsOptional()
  last_name?: string

  @IsOptional()
  @IsEmail()
  email?: string
  // role_id: string

  @IsOptional()
  role_id?: string

  @IsOptional()
  avatar?: string

  @ValidateIf((obj) => typeof obj.password === 'string' && obj.password.length > 0)
  @IsOptional()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must contain at least one number, lower or uppercase letter and it hat to be longer than 5 characters.',
  })
  password?: string

  @ValidateIf((obj) => typeof obj.confirm_password === 'string' && obj.confirm_password.length > 0)
  @IsOptional()
  @Match(UpdateUserDto, (s) => s.password, { message: 'Passwords do not match' }) //custom decorator
  confirm_password?: string
}
