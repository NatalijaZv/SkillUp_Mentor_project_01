import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from 'entities/user.entity'
import { Request } from 'express'
import { TokenPayload } from 'interfaces/auth.interface'
import { UsersService } from 'modules/users/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }
  async validate(payload: TokenPayload): Promise<User> {
    console.log('JwtStrategy')
    return await this.usersService.findById(payload.sub)
  }
}
