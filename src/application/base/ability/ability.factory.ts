import { createMongoAbility, Subject, MongoQuery, PureAbility, AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/infrastructure/database/entities/User";
import { AclService } from "src/application/base/acl/acl.service"
import { dbEntities } from "src/infrastructure/database/entityImporter/orm-entities";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}


//export type AppAbility = Ability<[Action,Subjects]>;


type Subjects = 'User' | 'Acl' | 'Invoices' | 'all';
const ability = createMongoAbility<[Action, Subject]>();

@Injectable()
export class AbilityFactory {
    constructor(
        private readonly aclService : AclService
    ){}

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
    async createForUser(user : User) {
        const builder = new AbilityBuilder(createMongoAbility);
      
        
        const acls = await this.aclService.find({
          where: [
            { principalType: '' },
            { principalType: 'User', principalId: user.id },
          ],
        });

        for (let acl of acls) {
            console.log(this.getModel(acl.model));
            let propertyCondition = '' ; 
            try {
              propertyCondition = JSON.parse(acl.property);
            }catch{
              propertyCondition = acl.property;
            }
            propertyCondition = acl.property;
            if (acl.permission == 'can'){
              console.log(propertyCondition);
             // console.log("can",acl.model,acl.accessType, acl.property, principalObject); 
             // builder.can(acl.accessType, this.getModel(acl.model), propertyCondition);
              builder.can(acl.accessType, acl.model, propertyCondition);

            }else{
             // console.log("can not ",acl.model, acl.accessType, acl.property, principalObject); 
         //     builder.cannot(acl.accessType, this.getModel(acl.model), propertyCondition);
              builder.cannot(acl.accessType, acl.model, propertyCondition);

            }
        };
        // builder.can(Action.Read, 'Invoices' , { user : user } ); 
        // action, subject, fields, conditions 
        if (user && user.username == 'admin') {
          builder.can(Action.Manage, "all");
        }

        return builder.build();
    }
}
