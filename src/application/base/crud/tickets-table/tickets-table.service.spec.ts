import { TestBed } from '@automock/jest';
import { TicketsTableService } from './tickets-table.service';

describe('TicketsTableService', () => {
  let service: TicketsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TicketsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
