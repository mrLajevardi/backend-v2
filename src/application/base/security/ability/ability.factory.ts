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
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ReservedVariablesInterface } from './interfaces/reserved-variables.interface';
import { ReservedVariablesEnum } from './enum/reserved-variables.enum';
import { isNil } from 'lodash';
import { ServiceStatusEnum } from '../../service/enum/service-status.enum';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { HookTypeEnum } from '../../crud/acl-table/enum/hook-type.enum';
import { AfterHookHandler } from './type/after-hook-handler.type';
import { UserAclsTableService } from '../../crud/user-acls-table/user-acls-table.service';
import { convertAccessTypeToAction } from '../../crud/acl-table/util/convert-accessType-to-action.util';

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
  constructor(
    private readonly aclTable: ACLTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly userAclTableService: UserAclsTableService,
  ) {}

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
  async createForUserBeforeHook(
    user: User,
  ): Promise<MongoAbility<AbilityTuple, MongoQuery>> {
    const builder = new AbilityBuilder(createMongoAbility);
    const simpleAcls = await this.aclTable.find({
      where: {
        // principalType: In([null, '']),
      },
    });
    const compoundAcls = await this.userAclTableService.find({
      where: {
        userId: user.id,
        // principalId: user ? user.id.toString() : null,
        hookType: HookTypeEnum.Before,
      },
    });

    const acls = [...simpleAcls, ...compoundAcls];
    const dependsOnServiceInstance = acls.some((acl) =>
      acl.property.includes(ReservedVariablesEnum.ServiceInstanceIds),
    );
    let serviceInstances: Pick<ServiceInstances, 'id'>[] = [];
    if (dependsOnServiceInstance) {
      serviceInstances = await this.serviceInstancesTableService.find({
        where: {
          userId: user.id,
          status: In([
            ServiceStatusEnum.Pending,
            ServiceStatusEnum.Error,
            ServiceStatusEnum.Success,
          ]),
          isDeleted: false,
          isDisabled: false,
        },
        select: ['id'],
      });
    }
    const serviceInstanceIds = serviceInstances.map((item) => item.id);
    //console.log('for userId' , user.id, 'simples', simpleAcls, 'com', compoundAcls);
    for (const acl of acls) {
      let propertyCondition: any = '';
      if (!isNil(acl.property)) {
        propertyCondition = this.replaceVariables(
          { serviceInstanceIds, userId: user.id },
          acl.property,
        );
        try {
          propertyCondition = JSON.parse(propertyCondition);
        } catch {
          propertyCondition = null;
        }
      }
      // propertyCondition = {
      //   s: 1,
      // };
      //console.log("parsed query: ", propertyCondition);
      if (acl.can) {
        // console.log(propertyCondition);
        //console.log('can',acl.accessType,acl.model,propertyCondition);
        builder.can(
          convertAccessTypeToAction(acl.accessType),
          acl.model,
          propertyCondition,
        );
      } else {
        // console.log('cannot',acl.accessType,acl.model,propertyCondition);

        builder.cannot(
          convertAccessTypeToAction(acl.accessType),
          acl.model,
          propertyCondition,
        );
      }
    }
    //  builder.can(Action.Read, 'Invoices' , JSON.parse('{ "payed" : false, "user": {}  }') );
    // action, subject, fields, conditions
    if (user && user.username == 'admin') {
      builder.can(Action.Manage, 'all');
    }

    return builder.build();
  }

  // async createForUserAfterHook(handler?: AfterHookHandler) {

  // }

  private replaceVariables(
    reservedVariables: ReservedVariablesInterface,
    property: string,
  ): string {
    const stringifiedServiceInstances = JSON.stringify(
      reservedVariables.serviceInstanceIds,
    );
    const replacedServiceInstance = property.replaceAll(
      ReservedVariablesEnum.ServiceInstanceIds,
      stringifiedServiceInstances,
    );
    const replacedUserId = replacedServiceInstance.replaceAll(
      ReservedVariablesEnum.UserId,
      reservedVariables.userId.toString(),
    );
    return replacedUserId;
  }
}
