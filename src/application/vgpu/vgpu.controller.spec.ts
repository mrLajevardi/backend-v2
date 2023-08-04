import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { VgpuService } from './vgpu.service';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';

describe('VgpuController', () => {
  let controller: VgpuController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        JwtModule,
        SessionsModule,
        PayAsYouGoModule,
        TasksModule,
      ],
      providers: [VgpuService],
      controllers: [VgpuController],
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
