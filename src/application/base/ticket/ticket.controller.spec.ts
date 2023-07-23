import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [TicketController],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
