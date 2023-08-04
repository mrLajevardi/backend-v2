import { Module, forwardRef } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { VgpuDnatService } from './vgpu-dnat.service';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';

@Module({
  imports: [
    CrudModule,
    DatabaseModule,
    JwtModule,
    SessionsModule,
    TasksModule,
    PayAsYouGoModule,
  ],
  providers: [VgpuService, JwtService, VgpuDnatService],
  controllers: [VgpuController],
  exports: [VgpuService],
})
export class VgpuModule {}
