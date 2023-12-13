import { Test, TestingModule } from '@nestjs/testing';
import { ServicePaymentsTableService } from './service-payments-table.service';

describe('ServicePaymentsTableService', () => {
  let service: ServicePaymentsTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePaymentsTableService],
    }).compile();

    service = module.get<ServicePaymentsTableService>(
      ServicePaymentsTableService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
