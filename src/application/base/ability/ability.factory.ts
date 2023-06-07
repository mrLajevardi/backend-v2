import { createMongoAbility, Subject, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import { AclService } from 'src/application/base/acl/acl.service';
import { dbEntities } from 'src/infrastructure/database/entityImporter/orm-entities';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = (typeof dbEntities)[number] | 'all';
export const ability = createMongoAbility<[Action, Subject]>();

@Injectable()
export class AbilityFactory {
  constructor(private readonly aclService: AclService) {}

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
  async createForUser(user: User) {
    const builder = new AbilityBuilder(createMongoAbility);

    const acls = await this.aclService.find({
      where: [
        { principalType: '' },
        { principalType: 'User', principalId: user ? user.id : '' },
      ],
    });

    for (const acl of acls) {
      let propertyCondition = '';
      try {
        console.log(acl.property);
        eval('propertyCondition=' + acl.property);
        //console.log("parsed query: ", propertyCondition);
      } catch (error) {
        propertyCondition = acl.property;
        console.log(error);
        console.log('Error parsing query, treat as simple field list ');
      }
      if (acl.permission == 'can') {
        console.log(propertyCondition);
        builder.can(acl.accessType, acl.model, propertyCondition);
      } else {
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
