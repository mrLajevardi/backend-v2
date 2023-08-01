import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminService } from './user-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('UserAdminService', () => {
  let service: UserAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UserAdminService],
    }).compile();

    service = module.get<UserAdminService>(UserAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
