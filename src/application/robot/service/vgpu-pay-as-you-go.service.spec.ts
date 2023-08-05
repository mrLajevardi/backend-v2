import { Test, TestingModule } from '@nestjs/testing';
import { VgpuPayAsYouGoService } from './vgpu-pay-as-you-go.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('VgpuPayAsYouGoService', () => {
  let service: VgpuPayAsYouGoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [VgpuPayAsYouGoService],
    }).compile();

    service = module.get<VgpuPayAsYouGoService>(VgpuPayAsYouGoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
