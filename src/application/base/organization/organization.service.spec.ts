import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
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
