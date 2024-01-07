import { VmController } from './vm.controller';
import { TestBed } from '@automock/jest';
describe('VmController', () => {
  let controller: VmController;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
