import { Module, forwardRef } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UserModule } from '../user/user.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [
    DatabaseModule,
    SessionsModule,
    forwardRef(() => UserModule),
    CrudModule,
  ],
  providers: [OrganizationService],
  controllers: [],
  exports: [OrganizationService],
})
export class OrganizationModule {}
