import { Ability, AbilityBuilder } from '@casl/ability';
import { Acl } from './path/to/Acl';

export const defineAbility = (aclRules: Acl[]): Ability => {
  const { can, rules } = new AbilityBuilder<Ability>();

  // Define the rules based on the ACL records
  aclRules.forEach((acl) => {
    can(acl.accessType, acl.model, { id: acl.principalId });
  });

  return new Ability(rules);
};
