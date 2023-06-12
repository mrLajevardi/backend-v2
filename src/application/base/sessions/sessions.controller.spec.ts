import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SessionsService } from './sessions.service';
import { UserService } from '../user/user.service';
import { OrganizationService } from '../organization/organization.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        SessionsService,
        UserService,
        OrganizationService
      ],
      controllers: [SessionsController],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
