import { Test, TestingModule } from '@nestjs/testing';
import { PermissionMappingsController } from './permission-mappings.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { PermissionMappingsService } from './permission-mappings.service';

describe('PermissionMappingsController', () => {
  let controller: PermissionMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionMappingsService],
      controllers: [PermissionMappingsController],
    }).compile();

    controller = module.get<PermissionMappingsController>(
      PermissionMappingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
