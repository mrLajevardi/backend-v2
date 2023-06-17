import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenController } from './access-token.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AccessTokenService } from './access-token.service';

describe('AccessTokenController', () => {
  let controller: AccessTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AccessTokenService],
      controllers: [AccessTokenController],
    }).compile();

    controller = module.get<AccessTokenController>(AccessTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
