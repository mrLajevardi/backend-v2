import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SessionsService } from '../sessions/sessions.service';
import { UserService } from '../user/user.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        OrganizationService,
        SessionsService,
        UserService,
        OrganizationTableService,
        SessionsTableService,
        UserTableService,
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
