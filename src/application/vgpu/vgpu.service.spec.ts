import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { BullModule } from '@nestjs/bull';

/// test instance 28697f62-a319-4e22-af49-075c34a14bb2

describe('VgpuService', () => {
  let service: VgpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
