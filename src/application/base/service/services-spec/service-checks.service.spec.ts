import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChecksService } from '../services/service-checks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule, DatabaseModule, SessionsModule, UserModule],
      providers: [ServiceChecksService],
    }).compile();

    service = module.get<ServiceChecksService>(ServiceChecksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
