import { Test, TestingModule } from '@nestjs/testing';
import { NetworksService } from './networks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NetworksService', () => {
  let service: NetworksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [NetworksService],
    }).compile();

    service = module.get<NetworksService>(NetworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
