import { VdcAdminController } from './vdc-admin.controller';
import { TestBed } from '@automock/jest';

describe('VdcAdminController', () => {
  let controller: VdcAdminController;

  beforeAll(async () => {
    const { unit } = TestBed.create(VdcAdminController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
