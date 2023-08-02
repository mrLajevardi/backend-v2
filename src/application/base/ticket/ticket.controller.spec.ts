import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { TicketService } from './ticket.service';

describe('TicketController', () => {
  let controller: TicketController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule,CrudModule],
      controllers: [TicketController],
      providers: [TicketService]
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
