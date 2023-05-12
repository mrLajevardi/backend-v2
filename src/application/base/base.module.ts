import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './security/auth/auth.module';
import { CaslModule } from './security/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/User';
import { GroupsMapping } from 'src/infrastructure/entities/GroupsMapping';

@Module({
    imports: [
        UserModule,
        AuthModule,
        CaslModule,
    ]
})
export class BaseModule {}
