import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { Acl } from 'src/infrastructure/database/test-entities/Acl';

describe('AbilityController', () => {
  let controller: AbilityController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule],
      controllers: [AbilityController],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
