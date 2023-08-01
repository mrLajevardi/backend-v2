import { Test, TestingModule } from '@nestjs/testing';
import { SecurityToolsService } from './security-tools.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('SecurityToolsService', () => {
  let service: SecurityToolsService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SecurityToolsService],
    }).compile();

    service = module.get<SecurityToolsService>(SecurityToolsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
