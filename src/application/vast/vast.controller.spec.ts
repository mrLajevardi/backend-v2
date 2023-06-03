import { Test, TestingModule } from '@nestjs/testing';
import { VastController } from './vast.controller';
import { AbilityModule } from '../base/ability/ability.module';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('VastController', () => {
  let controller: VastController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [VastController],
    }).compile();

    controller = module.get<VastController>(VastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
