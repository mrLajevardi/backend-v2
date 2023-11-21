import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceTableService } from './province-table.service';

describe('ProvinceTableService', () => {
  let service: ProvinceTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvinceTableService],
    }).compile();

    service = module.get<ProvinceTableService>(ProvinceTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
