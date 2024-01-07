import { AppController } from './app.controller';
import { TestBed } from '@automock/jest';

describe('AppController', () => {
  let controller: AppController;

  beforeAll(async () => {
    const { unit } = TestBed.create(AppController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
