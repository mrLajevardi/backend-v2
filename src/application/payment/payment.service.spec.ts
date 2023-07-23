import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
