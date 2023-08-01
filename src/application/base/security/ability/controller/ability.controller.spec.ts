import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AbilityController],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
