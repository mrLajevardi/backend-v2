import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemTypesTreeService } from './service-item-types-tree.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ServiceItemTypesTreeService', () => {
  let service: ServiceItemTypesTreeService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceItemTypesTreeService],
    }).compile();

    service = module.get<ServiceItemTypesTreeService>(
      ServiceItemTypesTreeService,
    );
  });
  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
