import { ServiceAdminController } from './service-admin.controller';
import { TestBed } from '@automock/jest';

describe('ServiceAdminController', () => {
  let controller: ServiceAdminController;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceAdminController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
