import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserModule } from '../base/user/user.module';
import { UserService } from '../base/user/user.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AiController],
  providers: [AiService, UserService],
})
export class AiModule {}
