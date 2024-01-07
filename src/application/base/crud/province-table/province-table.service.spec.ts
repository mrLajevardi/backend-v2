import { ProvinceTableService } from './province-table.service';
import { TestBed } from '@automock/jest';

describe('ProvinceTableService', () => {
  let service: ProvinceTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ProvinceTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
