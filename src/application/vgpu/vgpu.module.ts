import { Module, forwardRef } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { TasksModule } from '../base/tasks/tasks.module';

@Module({
  imports: [
    CrudModule,
    DatabaseModule,
    SessionsModule,
    ServiceModule,
    forwardRef(() => TasksModule),
  ],
  providers: [VgpuService],
  controllers: [VgpuController],
  exports: [VgpuService],
})
export class VgpuModule {}
