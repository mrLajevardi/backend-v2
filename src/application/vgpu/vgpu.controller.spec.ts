import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { CrudModule } from '../base/crud/crud.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { VgpuService } from './vgpu.service';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';
import { forwardRef } from '@nestjs/common';

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
        forwardRef(() => TasksModule),
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
