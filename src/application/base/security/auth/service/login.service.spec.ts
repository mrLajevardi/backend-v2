import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('LoginService', () => {
  let service: LoginService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [LoginService],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
