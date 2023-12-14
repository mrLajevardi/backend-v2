import { Test, TestingModule } from '@nestjs/testing';
import { ServicePaymentsTableService } from './service-payments-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';

describe('ServicePaymentsTableService', () => {
  let service: ServicePaymentsTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
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
