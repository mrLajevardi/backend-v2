import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { PlansService } from './plans.service';

describe('PlansController', () => {
  let controller: PlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PlansService],
      controllers: [PlansController],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
