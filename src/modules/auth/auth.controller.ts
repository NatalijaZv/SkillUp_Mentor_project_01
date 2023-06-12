import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Public } from 'decorators/public.decorator'
import { User } from 'entities/user.entity'
import { Request, Response } from 'express'
import { RequestWithUser } from 'interfaces/auth.interface'

import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // we need to use ClassSerializedInterceptor, if we dont, Exclude in Base Entitiy will not be used
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Register new user.' })
  @ApiBadRequestResponse({ description: 'Error for register new user.' })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body)
  }
  @ApiCreatedResponse({ description: 'Login.' })
  @ApiBadRequestResponse({ description: 'Error with login.' })
  @Public()
  @UseGuards(LocalAuthGuard) //user object is added in request object with method validateUser (in authService). this method is called in local strategy - in bulit in method validate, we
  //are calling our validateUser method.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, { httpOnly: true })
    console.log(req.user)
    return req.user
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token']
    return this.authService.user(cookie)
  }

  @ApiCreatedResponse({ description: 'Signout.' })
  @ApiBadRequestResponse({ description: 'Error with signout.' })
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
    res.clearCookie('access_token')
    return { msg: 'ok' }
  }
}
