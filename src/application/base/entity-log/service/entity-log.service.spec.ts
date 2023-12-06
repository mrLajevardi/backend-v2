import { Test, TestingModule } from '@nestjs/testing';
import { EntityLogService } from './entity-log.service';
import { EntityLogController } from '../entity-log.controller';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';

describe('EntityLogService', () => {
  let service: EntityLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityLogController],
      imports: [DatabaseModule, CrudModule],
      providers: [EntityLogService],
    }).compile();

    service = module.get<EntityLogService>(EntityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
