import { Test, TestingModule } from '@nestjs/testing';
import { EmailContentService } from './email-content.service';

describe('EmailContentService', () => {
  let service: EmailContentService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      providers: [EmailContentService],
    }).compile();

    service = module.get<EmailContentService>(EmailContentService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
