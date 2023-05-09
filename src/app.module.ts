import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ApplicationModule } from './application/application.module';
import { UtilsModule } from './utils/utils.module';


@Module({
  imports: [CommonModule, ApplicationModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
