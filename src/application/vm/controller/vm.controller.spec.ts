import { Test, TestingModule } from '@nestjs/testing';
import { VmController } from './vm.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
describe('VmController', () => {
  let controller: VmController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
      controllers: [VmController],
    }).compile();

    controller = module.get<VmController>(VmController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
