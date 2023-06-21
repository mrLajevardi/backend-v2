import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsMappingsController } from './permission-groups-mappings.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { PermissionGroupsMappingsService } from './permission-groups-mappings.service';

describe('PermissionGroupsMappingsController', () => {
  let controller: PermissionGroupsMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionGroupsMappingsService],
      controllers: [PermissionGroupsMappingsController],
    }).compile();

    controller = module.get<PermissionGroupsMappingsController>(
      PermissionGroupsMappingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
