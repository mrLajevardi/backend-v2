import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
