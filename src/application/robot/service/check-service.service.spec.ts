import { Test, TestingModule } from '@nestjs/testing';
import { CheckServiceService } from './check-service.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('CheckServiceService', () => {
  let service: CheckServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [CheckServiceService],
    }).compile();

    service = module.get<CheckServiceService>(CheckServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
