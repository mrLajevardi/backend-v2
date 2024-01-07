import { VastController } from './vast.controller';
import { TestBed } from '@automock/jest';

describe('VastController', () => {
  let controller: VastController;

  beforeAll(async () => {
    const { unit } = TestBed.create(VastController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
