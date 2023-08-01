import { Test, TestingModule } from '@nestjs/testing';
import { ZarinpalService } from './zarinpal.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ZarinpalService', () => {
  let service: ZarinpalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ZarinpalService],
    }).compile();

    service = module.get<ZarinpalService>(ZarinpalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
