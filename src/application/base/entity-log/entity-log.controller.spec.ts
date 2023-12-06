import { Test, TestingModule } from '@nestjs/testing';
import { EntityLogController } from './entity-log.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { EntityLogService } from './service/entity-log.service';

describe('EntityLogController', () => {
  let controller: EntityLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityLogController],
      imports: [DatabaseModule, CrudModule],
      providers: [EntityLogService],
    }).compile();

    controller = module.get<EntityLogController>(EntityLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
