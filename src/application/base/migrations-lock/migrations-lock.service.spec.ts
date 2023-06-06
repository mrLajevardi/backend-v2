import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsLockController } from './migrations-lock.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { MigrationsLockService } from './migrations-lock.service';

describe('MigrationsLockController', () => {
  let controller: MigrationsLockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [MigrationsLockService],
      controllers: [MigrationsLockController],
    }).compile();

    controller = module.get<MigrationsLockController>(MigrationsLockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
