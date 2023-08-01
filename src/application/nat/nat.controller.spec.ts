import { Test, TestingModule } from '@nestjs/testing';
import { NatController } from './nat.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NatController', () => {
  let controller: NatController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [NatController],
    }).compile();

    controller = module.get<NatController>(NatController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
