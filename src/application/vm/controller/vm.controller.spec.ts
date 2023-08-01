import { Test, TestingModule } from '@nestjs/testing';
import { VmController } from './vm.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
describe('VmController', () => {
  let controller: VmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
      controllers: [VmController],
    }).compile();

    controller = module.get<VmController>(VmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
