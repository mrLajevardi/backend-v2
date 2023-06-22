import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SessionsService } from '../base/sessions/sessions.service';
import { UserService } from '../base/user/user.service';
import { OrganizationService } from '../base/organization/organization.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { OrganizationTableService } from '../base/crud/organization-table/organization-table.service';

describe('VgpuService', () => {
  let service: VgpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        VgpuService,
        SessionsService,
        UserService,
        OrganizationService,
        ConfigsTableService,
        UserTableService,
        SessionsTableService,
        OrganizationTableService
      ],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
