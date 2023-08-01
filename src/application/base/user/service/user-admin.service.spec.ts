import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminService } from './user-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('UserAdminService', () => {
  let service: UserAdminService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UserAdminService],
    }).compile();

    service = module.get<UserAdminService>(UserAdminService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
