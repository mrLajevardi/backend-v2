import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserService } from '../user/user/user.service';
import { OrganizationService } from '../organization/organization.service';

@Module({
  imports: [DatabaseModule],
  providers: [SessionsService, UserService, OrganizationService],
  controllers: [SessionsController],
  exports: [SessionsService],

})
export class SessionsModule {}
