import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UserModule } from '../user/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    SessionsModule,
    UserModule
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService]
})
export class OrganizationModule {}
