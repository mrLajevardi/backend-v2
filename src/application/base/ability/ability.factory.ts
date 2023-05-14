import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Acl } from "src/infrastructure/entities/Acl";
import { User } from "src/infrastructure/entities/User";
import { AclService } from "src/application/base/acl/acl.service"
import { dbEntities } from "src/infrastructure/configs/ormconfig";

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
    async createForUser(user : User){
        const { can, cannot, build } = new AbilityBuilder(Ability);

        const acl = await this.aclService.findAll();
        acl.forEach(acl => {
            const principalObject = { [acl.principalType]: JSON.parse(acl.principalId) };
            if (acl.permission == 'can'){
              can(this.actionLookup[acl.accessType], this.getModel(acl.model), acl.property, principalObject);
            }else{
              cannot(this.actionLookup[acl.accessType], this.getModel(acl.model), acl.property, principalObject);
            }
        });

        if (user.username == 'admin') {
            can(Action.Manage, "all");
        }

        return build({
            detectSubjectType: (item) => 
                item.constructor as ExtractSubjectType<Subjects>
        })
    }
}
