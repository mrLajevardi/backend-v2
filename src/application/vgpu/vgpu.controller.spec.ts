import { VgpuController } from './vgpu.controller';
import { TestBed } from '@automock/jest';

describe('VgpuController', () => {
  let controller: VgpuController;

  beforeAll(async () => {
    const { unit } = TestBed.create(VgpuController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
