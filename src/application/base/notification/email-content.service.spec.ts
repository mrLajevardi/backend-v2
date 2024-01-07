import { EmailContentService } from './email-content.service';
import { TestBed } from '@automock/jest';

describe('EmailContentService', () => {
  let service: EmailContentService;

  beforeAll(async () => {
    const { unit } = TestBed.create(EmailContentService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
