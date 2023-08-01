import { Test, TestingModule } from '@nestjs/testing';
import { VmController } from './vm.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
describe('VmController', () => {
  let controller: VmController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
      controllers: [VmController],
    }).compile();

    controller = module.get<VmController>(VmController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
