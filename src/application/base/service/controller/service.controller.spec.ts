import { ServiceController } from './service.controller';
import { TestBed } from '@automock/jest';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
