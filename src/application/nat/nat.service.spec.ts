import { Test, TestingModule } from '@nestjs/testing';
import { NatService } from './nat.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('NatService', () => {
  let service: NatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [NatService],
    }).compile();

    service = module.get<NatService>(NatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
