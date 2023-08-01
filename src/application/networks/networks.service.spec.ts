import { Test, TestingModule } from '@nestjs/testing';
import { NetworksService } from './networks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NetworksService', () => {
  let service: NetworksService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [NetworksService],
    }).compile();

    service = module.get<NetworksService>(NetworksService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
