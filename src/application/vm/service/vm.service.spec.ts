import { Test, TestingModule } from '@nestjs/testing';
import { VmService } from './vm.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

describe('VmService', () => {
  let service: VmService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
    }).compile();

    service = module.get<VmService>(VmService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
