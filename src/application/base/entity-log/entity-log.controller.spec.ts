import { EntityLogController } from './entity-log.controller';
import { TestBed } from '@automock/jest';

describe('EntityLogController', () => {
  let controller: EntityLogController;

  beforeAll(async () => {
    const { unit } = TestBed.create(EntityLogController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
