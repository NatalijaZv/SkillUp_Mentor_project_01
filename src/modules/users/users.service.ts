import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'entities/user.entity'
import { PostgresErrorCode } from 'helpers/postgresErrorCode.enum'
import Logging from 'library/Logging'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { compareHash } from 'utils/bcrypt'
import { hash } from 'utils/bcrypt'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService extends AbstractService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
    super(usersRepository) // we need to add super, because we extending UsersService from AbstractService
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = (await this.findBy({ email: createUserDto.email })) as User
    if (user) {
      throw new BadRequestException('User with that email already exist')
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto, role: { id: createUserDto.role_id } })
      return this.usersRepository.save(newUser)
    } catch (err) {
      Logging.error(err)
      throw new BadRequestException('Something went wrong while creating new user.')
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id)) as User //user will be type of User
    const { email, password, confirm_password, role_id, ...data } = updateUserDto
    if (user.email !== email && email) {
      user.email === email
    } else if (email && user.email === email) {
      throw new BadRequestException('Users with that email already exist.')
    }
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.')
      }
      if (await compareHash(password, user.password)) {
        //user.password is allready encrypted, password is not
        throw new BadRequestException('New password cannot be the same as your old password.')
      }
      user.password = await hash(password)
    }
    if (role_id) {
      user.role = { ...user.role, id: role_id }
    }
    try {
      Object.entries(data).map((entry) => {
        //(entry) stands for key value pair, example: ['first_name','Natalija'] -> entry[0] is 'first_name', entry[1] is 'Natalija'
        user[entry[0]] = entry[1] // example: this means: user['first_name'] = 'Natalija'
      })
      //isto kot bi zapisali:
      // Object.entries(data).map(([key, value]) => {  //array destructuring
      //   user[key] = value
      // })
      return this.usersRepository.save(user)
    } catch (err) {
      Logging.error(err)
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that error allready exist')
      }
      throw new InternalServerErrorException('Something went wrong while updating the user.')
    }
  }
  async updateUserImageId(id: string, avatar: string): Promise<User> {
    const user = await this.findById(id)
    console.log(user)
    return this.update(user.id, { avatar })
  }
}
