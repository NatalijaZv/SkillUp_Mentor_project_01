import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { Role } from 'entities/role.entity'
import { PaginatedResult } from 'interfaces/paginated-result.interface'

import { CreateUpdateRoleDto } from './dto/create-update-role.dto'
import { RolesService } from './roles.service'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiCreatedResponse({ description: 'Finds all roles roles and permissions.' })
  @ApiBadRequestResponse({ description: 'Error for list of roles.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll(['permissions'])
  }
  @Get('/paginated')
  @HttpCode(HttpStatus.OK)
  async paginated(@Query('page') page: number): Promise<PaginatedResult> {
    return this.rolesService.paginate(page, ['permissions'])
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findById(id, ['permissions'])
  }

  @ApiCreatedResponse({ description: 'Creates new role' })
  @ApiBadRequestResponse({ description: 'Error for creating new role.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoleDto: CreateUpdateRoleDto,
    @Body('permissions') permissionsIds: string[],
  ): Promise<Role> {
    return this.rolesService.create(
      createRoleDto,
      permissionsIds.map((id) => ({ id })),
    )
  }

  @ApiCreatedResponse({ description: 'Update role with specific id.' })
  @ApiBadRequestResponse({ description: 'Error for updating role' })
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: CreateUpdateRoleDto,
    @Body('permissions') permissionsIds: string[],
  ) {
    return this.rolesService.update(
      id,
      updateRoleDto,
      permissionsIds.map((id) => ({ id })),
    )
  }

  @ApiCreatedResponse({ description: 'Delete role.' })
  @ApiBadRequestResponse({ description: 'Error for deleting users.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(id)
  }
}
