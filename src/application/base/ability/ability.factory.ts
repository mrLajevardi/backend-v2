import { Ability, AbilityBuilder, AbilityClass, AbilityTuple, ExtractSubjectType, InferSubjects, MongoQuery } from "@casl/ability";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Acl } from "src/infrastructure/database/entities/Acl";
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

type Subjects = InferSubjects<typeof User | typeof Acl > | 'all';

export type AppAbility = Ability<[Action,Subjects]>;

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

    // for retrieving enum member with string 
    actionLookup: { [key: string]: Action } = {
      create: Action.Create,
    };

    // creates the abilities related to the user . 
    async createForUser(user : User) {
      const { can, cannot, build } = new AbilityBuilder<
              Ability<[Action, Subjects]>
            >(Ability as AbilityClass<AppAbility>);

        if (!user){
          throw new UnauthorizedException("No user is specified");
        }
        const acl = await this.aclService.findAll();
        acl.forEach(acl => {
            
            const principalObject = { [acl.principalType]: acl.principalId };
            if (acl.permission == 'can'){
              console.log("can",acl.model,acl.accessType, acl.property, principalObject); 
              can(this.actionLookup[acl.accessType], this.getModel(acl.model), acl.property, principalObject);
            }else{
              console.log("can not ",acl.model, acl.accessType, acl.property, principalObject); 

              cannot(this.actionLookup[acl.accessType], this.getModel(acl.model), acl.property, principalObject);
            }
        });
       // can(Action.Read,Acl,"",{ id : 2} ); 
        // action, subject, fields, conditions 
        if (user.username == 'admin') {
            can(Action.Manage, "all");
        }

        return build({
            detectSubjectType: (item) => 
                item.constructor as ExtractSubjectType<Subjects>
        })
    }
}
