import { VgpuService } from './vgpu.service';
import { TestBed } from '@automock/jest';

/// test instance 28697f62-a319-4e22-af49-075c34a14bb2

describe('VgpuService', () => {
  let service: VgpuService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VgpuService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
