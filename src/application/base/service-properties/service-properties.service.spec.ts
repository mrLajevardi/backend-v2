import { Test, TestingModule } from '@nestjs/testing';
import { ServicePropertiesService } from './service-properties.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

describe('ServicePropertiesService', () => {
  let service: ServicePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [ServicePropertiesService],
    }).compile();

    service = module.get<ServicePropertiesService>(ServicePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
