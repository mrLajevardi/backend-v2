import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserModule } from '../user/user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    DatabaseModule,
    //  UserModule,
    //  OrganizationModule
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
