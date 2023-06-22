import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingService } from './role-mapping.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('RoleMappingService', () => {
  let service: RoleMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [RoleMappingService],
    }).compile();

    service = module.get<RoleMappingService>(RoleMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
