import { TicketService } from './ticket.service';
import { TestBed } from '@automock/jest';

describe('TicketService', () => {
  let service: TicketService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TicketService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
