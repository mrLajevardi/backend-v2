import { Test, TestingModule } from '@nestjs/testing';
import { DatacenterController } from './datacenter.controller';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { mockProviderVdcs } from './mock/providers-vdcs.mock';
import { BASE_DATACENTER_SERVICE } from './interface/datacenter.interface';
import { DatacenterFactoryService } from './service/datacenter.factory.service';
import { createMock } from '@golevelup/ts-jest';
import { TestBed } from '@automock/jest';
import { UnitReference } from '@automock/core';

describe('GroupController', () => {
  let controller: DatacenterController;

  let module: UnitReference;
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
        // storagePolicies:,
        storagePolicies: [],
        location: 'ایران',
        title: 'امین',
        gens: [{ name: 'g1', id: mockProviderVdcs.values[0].id, enable: true }],
      },
    ];
    const { unit, unitRef } = TestBed.create(DatacenterController)
      .mock(BASE_DATACENTER_SERVICE)
      .using(datacenterServiceMockFactory(datacenterConfigWithGenMock))
      .compile();
    module = unitRef;
    controller = unit;
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
        enabled: true,
        enabledForBusiness: true,
        storagePolicies: [],
        gens: [
          {
            enable: true,
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
