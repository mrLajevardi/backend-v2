import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { OrganizationService } from './organization.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserService } from '../user/user/user.service';

describe('OrganizationController', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [OrganizationService, SessionsService, UserService],
      controllers: [OrganizationController],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
