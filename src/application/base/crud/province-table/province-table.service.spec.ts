import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceTableService } from './province-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';

describe('ProvinceTableService', () => {
  let service: ProvinceTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ProvinceTableService],
    }).compile();

    service = module.get<ProvinceTableService>(ProvinceTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
