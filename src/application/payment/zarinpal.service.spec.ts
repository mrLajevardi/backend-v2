import { Test, TestingModule } from '@nestjs/testing';
import { ZarinpalService } from './zarinpal.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ZarinpalService', () => {
  let service: ZarinpalService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ZarinpalService],
    }).compile();

    service = module.get<ZarinpalService>(ZarinpalService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
