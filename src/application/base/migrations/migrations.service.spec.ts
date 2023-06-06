import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsController } from './migrations.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { MigrationsService } from './migrations.service';

describe('MigrationsController', () => {
  let controller: MigrationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [MigrationsService],
      controllers: [MigrationsController],
    }).compile();

    controller = module.get<MigrationsController>(MigrationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
