import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesController } from './service-instances.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceTypesService } from '../service-types/service-types.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { CreateServiceTypesDto } from '../service-types/dto/create-service-types.dto';
import { CreateServiceInstancesDto } from './dto/create-service-instances.dto';
import { DiscountsService } from '../discounts/discounts.service';

describe('ServiceInstancesController', () => {
  let service: ServiceInstancesService;
  let serviceTypesService: ServiceTypesService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ServiceInstancesService,
        ServiceTypesService,
        ServiceItemsService,
        ServicePropertiesService,
        DiscountsService
      ],
      controllers: [ServiceInstancesController],
    }).compile();

    service = module.get<ServiceInstancesService>(ServiceInstancesService);
    serviceTypesService = module.get<ServiceTypesService>(ServiceTypesService);
    testDataService = module.get<TestDataService>(TestDataService);

    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create serviceInstance', async () => {
    const dto: CreateServiceTypesDto = {
      id: '1',
      title: 'test-service-type',
      baseFee: 12,
      createInstanceScript: 'string',
      verifyInstance: true,
      maxAvailable: 1,
      isPayg: true,
    };
    await serviceTypesService.create(dto);
    const serviceType = await serviceTypesService.findOne({
      where: { title: 'test-service-type' },
    });
    console.log(serviceType);
    const siDto: CreateServiceInstancesDto = {
      id: 2,
      userId: 1,
      serviceType: serviceType,
      status: 1,
      createDate: new Date(),
      lastUpdateDate: new Date(),
      expireDate: new Date(),
      index: 1,
    };
    siDto.serviceType = serviceType;

    const result = await service.create(siDto);
    expect(result.id).toBe('2');
    expect(result.serviceType.id).toBe('1');
  });
});
