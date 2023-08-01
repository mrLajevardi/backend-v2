import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TicketService],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
