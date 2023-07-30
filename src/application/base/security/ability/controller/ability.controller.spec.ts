import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [AbilityController],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
