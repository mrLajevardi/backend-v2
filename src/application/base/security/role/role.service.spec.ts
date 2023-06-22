import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
