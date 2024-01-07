import { ZarinpalService } from './zarinpal.service';
import { TestBed } from '@automock/jest';

describe('ZarinpalService', () => {
  let service: ZarinpalService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ZarinpalService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
