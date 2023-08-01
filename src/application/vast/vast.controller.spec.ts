import { Test, TestingModule } from '@nestjs/testing';
import { VastController } from './vast.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('VastController', () => {
  let controller: VastController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [VastController],
    }).compile();

    controller = module.get<VastController>(VastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
