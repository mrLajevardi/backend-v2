import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ConfigsService } from '../base/service/configs/configs.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { UserService } from '../base/user/user/user.service';
import { OrganizationService } from '../base/organization/organization.service';

describe('VgpuService', () => {
  let service: VgpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        VgpuService,
        ConfigsService,
        SessionsService,
        UserService,
        OrganizationService,
      ],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
