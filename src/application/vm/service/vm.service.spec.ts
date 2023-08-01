import { Test, TestingModule } from '@nestjs/testing';
import { VmService } from './vm.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

describe('VmService', () => {
  let service: VmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
    }).compile();

    service = module.get<VmService>(VmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
