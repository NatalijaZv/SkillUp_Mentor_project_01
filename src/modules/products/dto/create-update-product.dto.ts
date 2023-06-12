import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUpdateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  price: number

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string
}
