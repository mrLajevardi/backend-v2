import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';



@Module({
  imports: [DatabaseModule],
  providers: [UserService]
})
export class UserModule {}
