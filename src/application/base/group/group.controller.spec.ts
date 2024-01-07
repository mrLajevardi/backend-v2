import { GroupController } from './group.controller';
import { TestBed } from '@automock/jest';

describe('GroupController', () => {
  let controller: GroupController;

  beforeAll(async () => {
    const { unit } = TestBed.create(GroupController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
