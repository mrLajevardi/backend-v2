import { VdcService } from './vdc.service';
import { TestBed } from '@automock/jest';

describe('VdcService', () => {
  let service: VdcService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VdcService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
