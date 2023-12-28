import { Test, TestingModule } from '@nestjs/testing';
import { FileTableService } from './file-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../crud.module';
import { LoggerModule } from '../../../../infrastructure/logger/logger.module';
import { PaymentModule } from '../../../payment/payment.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';

describe('FileTableService', () => {
  let service: FileTableService;

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
      providers: [FileTableService],
    }).compile();

    service = module.get<FileTableService>(FileTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
