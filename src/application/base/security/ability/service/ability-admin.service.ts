import { Injectable } from '@nestjs/common';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { AbilitySubjects, Action } from '../ability.factory';
import { User } from 'src/infrastructure/database/entities/User';

@Injectable()
export class AbilityAdminService {
  constructor(
    private readonly aclTable: ACLTableService,
    private readonly userTable: UserTableService,
  ) {}

  getAvailableModules() {
    return [

    ]
  }

  async permitAccessToUser( accessType : Action , on : string , to : User ) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: to.id.toString(),
    })
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: to.id.toString(),
      permission: 'can'
    })
  }

  async denyAccessFromUser( accessType : Action, on : string , from : User ) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: from.id.toString(),
    })
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: from.id.toString(),
      permission: 'cannot'
    })
  }

  

}
