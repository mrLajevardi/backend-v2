import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsService } from '../sessions/sessions.service';
import { UserService } from '../user/service/user.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
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

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
