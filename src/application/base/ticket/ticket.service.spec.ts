import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TicketService],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
