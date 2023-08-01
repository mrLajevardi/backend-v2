import { Test, TestingModule } from '@nestjs/testing';
import { NatService } from './nat.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NatService', () => {
  let service: NatService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [NatService],
    }).compile();

    service = module.get<NatService>(NatService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
