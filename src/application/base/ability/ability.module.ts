import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { AclService } from '../acl/acl.service';
import { AclModule } from '../acl/acl.module';

@Module({
    imports: [
        AclModule
    ],
    providers: [
        AbilityFactory,
        AclService
    ],
    exports: [
        AbilityFactory,
    ]
})
export class AbilityModule {}
