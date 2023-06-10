import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsService } from './sysdiagrams.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('SysdiagramsService', () => {
  let service: SysdiagramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SysdiagramsService],
    }).compile();

    service = module.get<SysdiagramsService>(SysdiagramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
