import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';



@Module({
  imports: [InfrastructureModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
