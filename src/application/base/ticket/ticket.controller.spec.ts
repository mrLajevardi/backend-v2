import { TicketController } from './ticket.controller';
import { TestBed } from '@automock/jest';

describe('TicketController', () => {
  let controller: TicketController;

  beforeAll(async () => {
    const { unit } = TestBed.create(TicketController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
