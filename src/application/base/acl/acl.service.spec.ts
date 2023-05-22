import { Test, TestingModule } from '@nestjs/testing';
import { AclService } from './acl.service';
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/test-entities/Acl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AppModule } from 'src/app.module';

describe('AclService', () => {
  let service: AclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Acl])
      ],
      providers: [
        AclService,
      ],
    }).compile();

    service = module.get<AclService>(AclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
