import { VgpuPayAsYouGoService } from './vgpu-pay-as-you-go.service';
import { TestBed } from '@automock/jest';

describe('VgpuPayAsYouGoService', () => {
  let service: VgpuPayAsYouGoService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VgpuPayAsYouGoService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
