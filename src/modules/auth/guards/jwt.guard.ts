import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import Logging from 'library/Logging'
import { Observable } from 'rxjs'

@Injectable()
export class  JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super()
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('JwtAuthGuard')
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])

    const request = context.switchToHttp().getRequest()
    if (isPublic) return true
    try {
      const access_token = request.cookies['access_token']
      return !!this.jwtService.verify(access_token)
    } catch (err) {
      Logging.log(err)
      return false
    }
  }
}
