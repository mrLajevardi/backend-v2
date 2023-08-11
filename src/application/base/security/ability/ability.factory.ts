import {
  createMongoAbility,
  AbilityBuilder,
  MongoAbility,
  AbilityTuple,
  MongoQuery,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import { ACLTableService } from '../../crud/acl-table/acl-table.service';
import { dbEntities } from 'src/infrastructure/database/entityImporter/orm-entities';
import { PredefinedRoles } from './enum/predefined-enum.type';
import { Action } from './enum/action.enum';
import { In } from 'typeorm';
import { isEmpty } from 'lodash';

export type AbilitySubjects =
  | (typeof dbEntities)[number]
  | PredefinedRoles.AdminRole
  | PredefinedRoles.SuperAdminRole
  | PredefinedRoles.UserRole
  | 'all';

export function getStringListOfAbilities(): string[] {
  const retVal: string[] = ['all'];

  const roles = Object.values(PredefinedRoles);
  roles.forEach((role) => {
    retVal.push(role);
  });
  retVal.concat(roles);

  for (const entity of dbEntities) {
    retVal.push((entity as any).name);
  }

  return retVal;
}

export const ability = createMongoAbility<[Action, AbilitySubjects]>();

@Injectable()
export class AbilityFactory {
  constructor(private readonly aclTable: ACLTableService) {}

  // converts the string name of the entity class
  // to the class itself. because casl needs the class itself.
  getModel(className: string): any {
    for (const entity of dbEntities) {
      if ((entity as any).name === className) {
        return entity;
      }
    }
    return null; // Return null if the item is not found
  }

  // creates the abilities related to the user .
  async createForUser(
    user: User,
  ): Promise<MongoAbility<AbilityTuple, MongoQuery>> {
    const builder = new AbilityBuilder(createMongoAbility);

    const simpleAcls = await this.aclTable.find({
      where: {
        principalType: In([null, '']),
      },
    });
    const compoundAcls = await this.aclTable.find({
      where: {
        principalType: 'User',
        principalId: isEmpty(user) ? null : user.id.toString(),
      },
    });

    const acls = [...simpleAcls, ...compoundAcls];
    //console.log('for userId' , user.id, 'simples', simpleAcls, 'com', compoundAcls);
    for (const acl of acls) {
      let propertyCondition = '';
      try {
        // console.log(acl.property);
        eval('propertyCondition=' + acl.property);
        //console.log("parsed query: ", propertyCondition);
      } catch (error) {
        propertyCondition = acl.property;
        //console.log(error);
        //console.log('Error parsing query, treat as simple field list ');
      }
      if (acl.permission == 'can') {
        // console.log(propertyCondition);
        //console.log('can',acl.accessType,acl.model,propertyCondition);
        builder.can(acl.accessType, acl.model, propertyCondition);
      } else {
        // console.log('cannot',acl.accessType,acl.model,propertyCondition);

        builder.cannot(acl.accessType, acl.model, propertyCondition);
      }
    }
    //  builder.can(Action.Read, 'Invoices' , JSON.parse('{ "payed" : false, "user": {}  }') );
    // action, subject, fields, conditions
    if (user && user.username == 'admin') {
      builder.can(Action.Manage, 'all');
    }

    return builder.build();
  }
}
