import { Test, TestingModule } from '@nestjs/testing';
import { GroupsMappingController } from './groups-mapping.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { GroupsMappingService } from './groups-mapping.service';

describe('GroupsMappingController', () => {
  let controller: GroupsMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsMappingService],
      controllers: [GroupsMappingController],
    }).compile();

    controller = module.get<GroupsMappingController>(GroupsMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
