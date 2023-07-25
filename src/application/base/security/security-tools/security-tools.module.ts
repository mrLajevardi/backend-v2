import { Module } from '@nestjs/common';
import { SecurityToolsService } from './security-tools.service';
import { OtpService } from './otp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SecurityToolsService, OtpService],
  exports: [SecurityToolsService],
})
export class SecurityToolsModule {}
