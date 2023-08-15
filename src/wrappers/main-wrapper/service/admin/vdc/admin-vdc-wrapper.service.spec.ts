import { Test, TestingModule } from '@nestjs/testing';
import { AdminVdcWrapperService } from './admin-vdc-wrapper.service';

describe('AdminVdcWrapperService', () => {
  let service: AdminVdcWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminVdcWrapperService],
    }).compile();

    service = module.get<AdminVdcWrapperService>(AdminVdcWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
