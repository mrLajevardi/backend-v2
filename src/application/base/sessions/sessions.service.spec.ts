import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserService } from '../user/service/user.service';
import { OrganizationService } from '../organization/organization.service';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        SessionsService,
        UserService,
        OrganizationService,
        SessionsTableService,
        UserTableService,
        OrganizationTableService,
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
