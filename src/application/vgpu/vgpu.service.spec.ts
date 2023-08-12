import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CrudModule } from '../base/crud/crud.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';

/// test instance 28697f62-a319-4e22-af49-075c34a14bb2

describe('VgpuService', () => {
  let service: VgpuService;

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
      providers: [VgpuService, JwtService],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 
});
