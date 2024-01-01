import { Test, TestingModule } from '@nestjs/testing';
import { CompanyTableService } from './company-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../crud.module';
import { LoggerModule } from '../../../../infrastructure/logger/logger.module';
import { PaymentModule } from '../../../payment/payment.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';

describe('CompanyTableService', () => {
  let provider: CompanyTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
      ],
      providers: [CompanyTableService],
    }).compile();

    provider = module.get<CompanyTableService>(CompanyTableService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
