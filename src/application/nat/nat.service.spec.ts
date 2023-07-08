import { Test, TestingModule } from '@nestjs/testing';
import { NatService } from './nat.service';

describe('NatService', () => {
  let service: NatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatService],
    }).compile();

    service = module.get<NatService>(NatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
