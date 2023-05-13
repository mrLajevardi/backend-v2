import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@casl/nestjs';
import { Acl } from 'src/infrastructure/entities/Acl';
import { defineAbility } from './ability';

@Module({
  providers: [
    {
      provide: CaslAbilityFactory,
      useValue: defineAbility,
    },
    {
      provide: 'ACL_RULES',
      useValue: Acl, // Import the ACL entity and pass it here
    },
  ],
})
export class CaslModule {}
