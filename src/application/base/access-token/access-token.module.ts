import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { AccessTokenController } from './access-token.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [AccessTokenService],
  controllers: [AccessTokenController]
})
export class AccessTokenModule {}
