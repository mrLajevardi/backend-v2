import { Test, TestingModule } from '@nestjs/testing';
import { VastController } from './vast.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('VastController', () => {
  let controller: VastController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [VastController],
    }).compile();

    controller = module.get<VastController>(VastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
