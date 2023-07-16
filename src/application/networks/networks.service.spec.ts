import { Test, TestingModule } from '@nestjs/testing';
import { NetworksService } from './networks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('NetworksService', () => {
  let service: NetworksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [NetworksService],
    }).compile();

    service = module.get<NetworksService>(NetworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
