import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TicketsService],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
