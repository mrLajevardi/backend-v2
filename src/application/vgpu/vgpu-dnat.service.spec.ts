import { VgpuDnatService } from './vgpu-dnat.service';
import { TestBed } from '@automock/jest';

describe('VgpuDnatService', () => {
  let service: VgpuDnatService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VgpuDnatService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
