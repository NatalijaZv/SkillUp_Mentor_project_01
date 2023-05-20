import { Column, Entity, JoinColumn, JoinTable, ManyToMany } from 'typeorm'

import { Base } from './base.entity'
import { Permission } from './permission.entity'

@Entity()
export class Role extends Base {
  @Column()
  name: string

  //ManyToMany relationship - One role can have many premissions and one permission can be added to many roles
  //If we delete a row in ManyToMany table will delete all roles inside that table
  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_premission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  // JoinTable will create new table with name role_permission, which will have 
  //three columns -id, role_id and permission_id
  permissions: Permission[]
  role: Permission
}
