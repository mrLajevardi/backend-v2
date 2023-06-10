import { Test, TestingModule } from '@nestjs/testing';
import { ScopeController } from './scope.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ScopeService } from './scope.service';

describe('ScopeController', () => {
  let controller: ScopeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ScopeService],
      controllers: [ScopeController],
    }).compile();

    controller = module.get<ScopeController>(ScopeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
