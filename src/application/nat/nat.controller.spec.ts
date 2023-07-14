import { Test, TestingModule } from '@nestjs/testing';
import { NatController } from './nat.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('NatController', () => {
  let controller: NatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [NatController],
    }).compile();

    controller = module.get<NatController>(NatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
