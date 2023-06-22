import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    //  UserModule,
    //  OrganizationModule
  ],
  providers: [SessionsService],
  controllers: [],
  exports: [SessionsService],
})
export class SessionsModule {}
