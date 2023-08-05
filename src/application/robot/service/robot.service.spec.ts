import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('RobotService', () => {
  let service: RobotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [RobotService],
    }).compile();

    service = module.get<RobotService>(RobotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
