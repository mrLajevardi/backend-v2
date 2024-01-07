import { PayAsYouGoService } from './pay-as-you-go.service';
import { TestBed } from '@automock/jest';

describe('PayAsYouGoService', () => {
  let service: PayAsYouGoService;

  beforeAll(async () => {
    const { unit } = TestBed.create(PayAsYouGoService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
