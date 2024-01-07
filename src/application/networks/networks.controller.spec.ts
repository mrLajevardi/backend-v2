import { TestBed } from '@automock/jest';
import { NetworksController } from './networks.controller';

describe('NetworksController', () => {
  let controller: NetworksController;

  beforeAll(async () => {
    const { unit } = TestBed.create(NetworksController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
