import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsService } from '../sessions/sessions.service';
import { UserService } from '../user/service/user.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';
import { CrudModule } from '../crud/crud.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UserModule } from '../user/user.module';

describe('OrganizationService', () => {
  let service: OrganizationService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, SessionsModule, UserModule, CrudModule],
      providers: [OrganizationService],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
