import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Acl } from "src/infrastructure/entities/Acl";
import { User } from "src/infrastructure/entities/User";

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
    createForUser(user : User){
        const { can, cannot, build } = new AbilityBuilder(
            Ability as AbilityClass<AppAbility>,
        )

        if (user.username == 'admin') {
            can(Action.Manage, "all");
        }else{
            can(Action.Read, User);
        }

        return build({
            detectSubjectType: (item) => 
                item.constructor as ExtractSubjectType<Subjects>
        })
    }
}
