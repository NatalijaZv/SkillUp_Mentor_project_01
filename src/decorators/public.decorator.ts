//With this decorator we will allow routes to be accessible to every user

import { SetMetadata } from '@nestjs/common'

export const Public = () => SetMetadata('isPublic', true)
