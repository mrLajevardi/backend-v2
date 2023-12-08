import { Test, TestingModule } from '@nestjs/testing';
import { EntityLogTableService } from './entity-log-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';

describe('EntityLogTableService', () => {
  let service: EntityLogTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [EntityLogTableService],
    }).compile();

    service = module.get<EntityLogTableService>(EntityLogTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
