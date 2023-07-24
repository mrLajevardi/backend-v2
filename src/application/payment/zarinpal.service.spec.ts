import { Test, TestingModule } from '@nestjs/testing';
import { ZarinpalService } from './zarinpal.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ZarinpalService', () => {
  let service: ZarinpalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ZarinpalService],
    }).compile();

    service = module.get<ZarinpalService>(ZarinpalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
