import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { Match } from 'decorators/match.decorator'

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  role_id: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must contain at least one number, lower or uppercase letter and it hat to be longer than 5 characters.',
  })
  password: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Match(CreateUserDto, (s) => s.password, { message: 'Passwords do not match' }) //custom decorator
  confirm_password: string
}
