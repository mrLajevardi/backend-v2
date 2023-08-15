import {
  Test,
  TestingModule /*, TestingModuleBuilder*/,
} from '@nestjs/testing';
/* import { Repository } from 'typeorm'; */
/* import { TestDataService } from './test-data.service'; */
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  /* getRepositoryToken, */
} from '@nestjs/typeorm';
// Import other test entities...

/* import { Acl } from './entities/Acl'; */
/* import { DatabaseModule } from './database.module'; */
import { dbEntities } from './entityImporter/orm-entities';

describe('TestDataService', () => {
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          entities: dbEntities,
          synchronize: true,
        } as TypeOrmModuleOptions),
      ],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('seedTestData', () => {
    it('should insert contents in the db', async () => {
      // testDataService.seedTestData();
    });
  });
});
