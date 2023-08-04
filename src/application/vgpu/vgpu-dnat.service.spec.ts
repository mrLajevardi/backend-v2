import { Test, TestingModule } from '@nestjs/testing';
import { VgpuDnatService } from './vgpu-dnat.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../base/crud/crud.module';
import { SessionsModule } from '../base/sessions/sessions.module';

describe('VgpuDnatService', () => {
  let service: VgpuDnatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule, SessionsModule],
      providers: [VgpuDnatService],
    }).compile();

    service = module.get<VgpuDnatService>(VgpuDnatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
