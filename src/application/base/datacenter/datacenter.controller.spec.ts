import { Test, TestingModule } from '@nestjs/testing';
import { DatacenterController } from './datacenter.controller';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { mockProviderVdcs } from './mock/providers-vdcs.mock';

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
        title: 'امین',
        gens: [{ name: 'g1', id: mockProviderVdcs.values[0].id }],
      },
    ];
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: 'DatacenterService',
          useValue: datacenterServiceMockFactory(datacenterConfigWithGenMock),
        },
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
