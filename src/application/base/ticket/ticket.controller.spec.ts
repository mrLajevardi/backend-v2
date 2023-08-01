import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [TicketController],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
