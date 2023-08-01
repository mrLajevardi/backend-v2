import { Test, TestingModule } from '@nestjs/testing';
import { NatController } from './nat.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NatController', () => {
  let controller: NatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [NatController],
    }).compile();

    controller = module.get<NatController>(NatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
