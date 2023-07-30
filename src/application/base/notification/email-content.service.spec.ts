import { Test, TestingModule } from '@nestjs/testing';
import { EmailContentService } from './email-content.service';

describe('EmailContentService', () => {
  let service: EmailContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailContentService],
    }).compile();

    service = module.get<EmailContentService>(EmailContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
