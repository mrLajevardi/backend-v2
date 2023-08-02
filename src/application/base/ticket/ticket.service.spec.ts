import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

describe('TicketService', () => {
  let service: TicketService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [TicketService],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
