import { Test, TestingModule } from '@nestjs/testing';
import { PayAsYouGoService } from './pay-as-you-go.service';

describe('PayAsYouGoService', () => {
  let service: PayAsYouGoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayAsYouGoService],
    }).compile();

    service = module.get<PayAsYouGoService>(PayAsYouGoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
