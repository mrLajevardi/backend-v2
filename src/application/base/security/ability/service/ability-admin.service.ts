import { Injectable } from '@nestjs/common';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { AbilitySubjects } from '../ability.factory';
import { User } from 'src/infrastructure/database/entities/User';
import { Action } from '../enum/action.enum';
import { PredefinedRoles } from '../enum/predefined-enum.type';
import { BadRequestError } from 'passport-headerapikey';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { In } from 'typeorm';
import { PredefinedRoleDto } from '../dto/predefined-role.dto';
import { stringToEnum } from 'src/infrastructure/helpers/helpers';

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

  async getAllPredefinedRoles(userId: number){
    let returnResult : PredefinedRoleDto[] = [];
    const predefinedRoles = Object.values(PredefinedRoles);
    const result = await this.aclTable.find({
      where: {
        model: In(predefinedRoles),
        principalType: 'User',
        principalId: userId.toString()
      },
    })
    result.forEach(item => {
      // console.log(item);
      const dtoItem : PredefinedRoleDto = {
        action : stringToEnum(item.accessType,Action),
        permission: item.permission,
        model: stringToEnum(item.model, PredefinedRoles),
      }
      returnResult.push(dtoItem);
    });
    return returnResult; 
  }

  async assignPredefinedRole( userId: number , role: PredefinedRoles ){
    if (!role || !userId){
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: 'User',
      principalId: userId.toString()
    })

    await this.aclTable.create({
      model: role,
      principalType: 'User',
      principalId: userId.toString(),
      accessType: Action.Manage,
      permission: 'can'
    })
  }

  async deletePredefinedRole( userId: number, role: PredefinedRoles ){
    if (!role || !userId){
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: 'User',
      principalId: userId.toString()
    })
  }

  async denyPredefinedRole( userId: number, role: PredefinedRoles ){
    if (!role || !userId){
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: 'User',
      principalId: userId.toString()
    })

    await this.aclTable.create({
      model: role,
      principalType: 'User',
      principalId: userId.toString(),
      accessType: Action.Manage,
      permission: 'cannot'
    })
  }

  async permitAccessToUser( accessType : Action , on : string , to : number ) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: to.toString(),
    })
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: to.toString(),
      permission: 'can'
    })
  }

  async denyAccessFromUser( accessType : Action, on : string , from : number  ) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: from.toString(),
    })
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: from.toString(),
      permission: 'cannot'
    })
  }

  async deleteAccessForUser( accessType : Action, on : string , userId : number ){
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: 'User',
      principalId: userId.toString(),
    })
  }


  

}
