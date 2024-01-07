import { AxiosError } from 'axios';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import {
  DiskItemCodes,
  VdcGenerationItemCodes,
} from '../../base/itemType/enum/item-type-codes.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';
import { VdcDetailItemResultDto } from '../dto/vdc-detail-item.result.dto';
import { VdcItemLimitResultDto } from '../dto/vdc-Item-limit.result.dto';
import { VdcStoragesDetailResultDto } from '../dto/vdc-storages-detail.result.dto';
import { TestBed } from '@automock/jest';
import { VdcDetailService } from './vdc-detail.service';

describe('VdcDetailService', () => {
  let service: VdcDetailService;
  const validServiceInstanceId = '3C0E83BA-7883-445F-9BC4-1EFCA602CC51';
  const invalidServiceInstanceId =
    '3C0E834546adsBA-7asdasd883-44asdasd5F-9BC4-1EFCA602CC51';

  function getValidVdcDetailsResultDto(): VdcDetailsResultDto {
    return {
      disk: [
        {
          priceWithTax: 0,
          unit: 'GB',
          code: VdcGenerationItemCodes.Disk,
          usage: 10000,
          value: '1024',
          price: 10258,
          title: 'standard-disk',
        },
      ],
      servicePlanType: ServicePlanTypeEnum.Static,
      status: ServiceStatusEnum.Success,
      ram: {
        priceWithTax: 0,
        price: 1004,
        title: 'RAM',
        value: '4096',
        usage: 1024,
        code: VdcGenerationItemCodes.Ram,
        unit: 'GB',
      },
      cpu: {
        priceWithTax: 0,
        price: 123456,
        title: 'CPU',
        value: '8',
        usage: 4,
        code: VdcGenerationItemCodes.Cpu,
        unit: 'CORE',
      },
      generation: 'G1',
      daysLeft: 40,
      serviceName: 'ValidService',
      fillTaxAndDiscountProperties() {
        console.log();
      },
    };
  }

  beforeEach(async () => {
    const { unit } = TestBed.create(VdcDetailService).compile();
    service = unit;
  });

  it('should return a storage detail with valid instance id', async () => {
    const res: VdcStoragesDetailResultDto[] = [
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
    ];

    jest
      .spyOn(service, 'getStorageDetailVdc')
      .mockImplementation(() => Promise.resolve(res));

    expect(
      await service.getStorageDetailVdc(validServiceInstanceId, 0, 0, null),
    ).toBe(res);
  });

  it('should return axios error with invalid instanceId', async () => {
    const myMock = jest.fn();
    service.getStorageDetailVdc = myMock;
    myMock.mockImplementation(
      (invalidInstanceId: string) => new AxiosError(invalidInstanceId),
    );
    const res = await service.getStorageDetailVdc(
      invalidServiceInstanceId,
      0,
      0,
      null,
    );
    expect(res).toBeInstanceOf(AxiosError);
  });

  it('should return some some storage detail with valid instance id', async () => {
    const res: VdcStoragesDetailResultDto[] = [
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
      {
        id: '',
        value: 1000,
        usage: 258,
        title: 'disk',
      },
    ];

    jest
      .spyOn(service, 'getStorageDetailVdc')
      .mockImplementation(() => Promise.resolve(res));

    const models = await service.getStorageDetailVdc(
      validServiceInstanceId,
      0,
      0,
      null,
    );

    expect(models).toHaveLength(3);
    expect(models).toContain(res[2]);
  });

  it('should return vdc detail with valid instance id', async () => {
    const res: VdcDetailsResultDto = getValidVdcDetailsResultDto();

    const myMcok = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation(() => Promise.resolve(res));

    expect(await service.getVdcDetail(validServiceInstanceId)).toBe(res);
    expect(myMcok).toHaveBeenCalled();
  });

  it('should return null object with invalid instance id ', async () => {
    const res: VdcDetailsResultDto = new VdcDetailsResultDto();
    const myMock = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === invalidServiceInstanceId) {
          return Promise.resolve(new VdcDetailsResultDto());
        }
      });
    const resFunction = await service.getVdcDetail(invalidServiceInstanceId);
    expect(resFunction).toStrictEqual(res);
    expect(myMock).toHaveBeenCalled();
    myMock.mockRestore();
  });

  it('should not be null disk and ram and cpu and generation ', async () => {
    const res: VdcDetailsResultDto = getValidVdcDetailsResultDto();
    const myMock = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const models = await service.getVdcDetail(validServiceInstanceId);
    expect(models.disk.length).toBeGreaterThan(0);
    expect(models.disk[0].code).toBe(VdcGenerationItemCodes.Disk);
    expect(Number(models.disk[0].value)).toBeGreaterThan(0);

    expect(models.ram).toBeDefined();
    expect(models.ram.code.trim()).toBe(VdcGenerationItemCodes.Ram);
    expect(Number(models.ram.value)).toBeGreaterThan(0);

    expect(models.cpu).toBeDefined();
    expect(models.cpu.code.trim()).toBe(VdcGenerationItemCodes.Cpu);
    expect(Number(models.cpu.value)).toBeGreaterThan(0);

    expect(models.generation).toBeDefined();
    expect(models.generation.length).toBeGreaterThan(0);
  });

  it('should return null vdc detail items with invalid instanceId', async () => {
    const res: VdcDetailItemResultDto = {};
    const myMock = jest
      .spyOn(service, 'getVdcDetailItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId === invalidServiceInstanceId) {
          return Promise.resolve(res);
        }
      });
    const models = await service.getVdcDetailItems(
      null,
      invalidServiceInstanceId,
    );

    expect(models).toBe(res);
    expect(myMock).toHaveBeenCalled();
  });

  it('should return vdc detail items with valid instance id', async () => {
    const res: VdcDetailItemResultDto = {
      natRules: 10,
      media: 5,
      dhcpForwarding: true,
      ipSets: 5,
      firewalls: 4,
      namedDisk: 3,
      applicationPortProfiles: { custom: 1, default: 1 },
      networks: 3,
    };

    const myMock = jest
      .spyOn(service, 'getVdcDetailItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });
    const model = await service.getVdcDetailItems(null, validServiceInstanceId);
    expect(model).toBe(res);
    expect(model.ipSets).toBe(res.ipSets);
    expect(model.networks).toBe(res.networks);
    expect(model.natRules).toBe(res.natRules);
    expect(model.applicationPortProfiles).toBe(res.applicationPortProfiles);
    expect(myMock).toHaveBeenCalled();
  });

  it('should return vdc items limit with valid service instance id', async () => {
    const validRes: VdcItemLimitResultDto = {
      cpuInfo: { max: 4 },
      ramInfo: { max: 16 },
      diskInfo: [
        { name: DiskItemCodes.Archive },
        { name: DiskItemCodes.Fast },
        { name: DiskItemCodes.Swap },
        { name: DiskItemCodes.Standard },
        { name: DiskItemCodes.Vip },
      ],
    };
    const myMock = jest
      .spyOn(service, 'getVdcItemLimit')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(validRes);
        }
      });
    const res = await service.getVdcItemLimit(validServiceInstanceId, null);
    expect(res).not.toBeNull();
    expect(res.ramInfo.max).toBeGreaterThan(15);
    expect(res.cpuInfo.max).toBeGreaterThan(2);
    // expect(res.cpuInfo.cpuCoreCountable.length).toBeGreaterThan(0);
    expect(
      res.diskInfo.map((disk) => disk.name).includes(DiskItemCodes.Standard),
    ).toBe(true);
    expect(
      res.diskInfo.map((disk) => disk.name).includes(DiskItemCodes.Vip),
    ).toBe(true);
  });

  it('should return null with invalid service instance id  ', async () => {
    jest
      .spyOn(service, 'getVdcItemLimit')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === invalidServiceInstanceId) {
          return Promise.resolve({});
        }
      });

    const model = await service.getVdcItemLimit(invalidServiceInstanceId, null);

    expect(model.cpuInfo).toBeUndefined();
    expect(model.diskInfo).toBeUndefined();
    expect(model.ramInfo).toBeUndefined();
  });

  it('should return at least one disk type with valid service instance id ', async () => {
    const validRes: VdcItemLimitResultDto = {
      diskInfo: [{ name: DiskItemCodes.Standard }],
    };

    jest
      .spyOn(service, 'getVdcItemLimit')
      .mockImplementation((serviceInstanceId, option) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(validRes);
        }
      });

    const model = await service.getVdcItemLimit(validServiceInstanceId, null);

    expect(model.diskInfo.length).toBeGreaterThan(0);
    expect(
      model.diskInfo.map((disk) => disk.name).includes(DiskItemCodes.Standard),
    ).toBe(true);
  });

  it('should return two  disk type with a vdc that has two disk type ', async () => {
    const validRes: VdcItemLimitResultDto = {
      diskInfo: [
        { name: DiskItemCodes.Standard, id: '' },
        { name: DiskItemCodes.Archive, id: '' },
      ],
    };

    jest
      .spyOn(service, 'getVdcItemLimit')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(validRes);
        }
      });

    const model = await service.getVdcItemLimit(validServiceInstanceId, null);

    expect(model.diskInfo.length).toBe(2);
    expect(
      model.diskInfo
        .map((disk) => disk.name)
        .includes(DiskItemCodes.Standard) &&
        model.diskInfo.map((disk) => disk.name).includes(DiskItemCodes.Archive),
    ).toBe(true);
  });
});
