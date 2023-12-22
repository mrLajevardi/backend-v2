import { Test, TestingModule } from '@nestjs/testing';
import { DatacenterController } from './datacenter.controller';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { mockProviderVdcs } from './mock/providers-vdcs.mock';
import { BASE_DATACENTER_SERVICE } from './interface/datacenter.interface';
import { DatacenterFactoryService } from './service/datacenter.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { CrudModule } from '../crud/crud.module';

describe('GroupController', () => {
  let controller: DatacenterController;

  let module: TestingModule;
  function datacenterServiceMockFactory(
    getDatacenterConfigWithGenResult: DatacenterConfigGenResultDto[],
  ): Partial<DatacenterService> {
    const datacenterServiceMock: Partial<DatacenterService> = {
      async getDatacenterConfigWithGen(): Promise<
        DatacenterConfigGenResultDto[]
      > {
        return getDatacenterConfigWithGenResult;
      },
    };
    return datacenterServiceMock;
  }
  beforeEach(async () => {
    const datacenterConfigWithGenMock: DatacenterConfigGenResultDto[] = [
      {
        datacenter: 'amin',
        enabled: true,
        enabledForBusiness: true,
        storagePolicies: 
        location: 'ایران',
        title: 'امین',
        gens: [{ name: 'g1', id: mockProviderVdcs.values[0].id }],
      },
    ];
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: BASE_DATACENTER_SERVICE,
          useValue: datacenterServiceMockFactory(datacenterConfigWithGenMock),
        },
        DatacenterFactoryService,
      ],
      controllers: [DatacenterController],
    }).compile();

    controller = module.get<DatacenterController>(DatacenterController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return correct response', async () => {
    const correctResult: DatacenterConfigGenResultDto[] = [
      {
        datacenter: 'amin',
        location: 'ایران',
        title: 'امین',
        gens: [
          {
            name: 'g1',
            id: mockProviderVdcs.values[0].id,
          },
        ],
      },
    ];
    const result = await controller.getDatacenterWithGens();
    expect(result).toStrictEqual(correctResult);
  });
});
