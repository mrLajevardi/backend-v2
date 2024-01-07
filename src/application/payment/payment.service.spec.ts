import { PaymentService } from './payment.service';
import { TestBed } from '@automock/jest';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const { unit } = TestBed.create(PaymentService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
