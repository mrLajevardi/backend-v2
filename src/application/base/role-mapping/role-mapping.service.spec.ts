import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingController } from './role-mapping.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { RoleMappingService } from './role-mapping.service';

describe('RoleMappingController', () => {
  let controller: RoleMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [RoleMappingService],
      controllers: [RoleMappingController],
    }).compile();

    controller = module.get<RoleMappingController>(RoleMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
