import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { DatabaseModule } from '../database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';

describe('LoggerService', () => {
  let service: LoggerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
