import { Test, TestingModule } from '@nestjs/testing';
import { SecurityToolsService } from './security-tools.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('SecurityToolsService', () => {
  let service: SecurityToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SecurityToolsService],
    }).compile();

    service = module.get<SecurityToolsService>(SecurityToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
