import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AbilityController],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
