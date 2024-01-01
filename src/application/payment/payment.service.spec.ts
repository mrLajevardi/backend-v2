import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ZarinpalService } from './zarinpal.service';

describe('PaymentService', () => {
  let service: PaymentService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PaymentService, ZarinpalService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
