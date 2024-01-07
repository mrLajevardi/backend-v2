import { VdcDetailFactoryService } from './vdc-detail.factory.service';
import { VdcDetailModel } from '../interface/vdc-detail-model.interface';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { TestBed } from '@automock/jest';

describe('VdcDetailFactoryService', () => {
  let service: VdcDetailFactoryService;
  const validServiceInstanceId = '3C0E83BA-7883-445F-9BC4-1EFCA602CC51';
  const inValidServiceInstanceId = 'asdkal;dksa5456878adasd';

  function getVdcDetailModel(): VdcDetailModel[] {
    return [
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 1,
        name: 'TEST_SERVICE',
        codeHierarchy: '1_2_3',
        daysLeft: 44,
        max: 10,
        unit: 'GB',
        min: 4,
        status: ServiceStatusEnum.Success,
        value: '5',
        title: 'RAM',
        servicePlanType: ServicePlanTypeEnum.Static,
        datacenterName: 'Amin',
      },
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 2,
        name: 'TEST_SERVICE',
        codeHierarchy: '1_2_3',
        daysLeft: 44,
        max: 10,
        unit: 'CORE',
        min: 4,
        status: ServiceStatusEnum.Success,
        value: '5',
        title: 'CPU',
        servicePlanType: ServicePlanTypeEnum.Static,
        datacenterName: 'Amin',
      },
    ];
  }

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(VdcDetailFactoryService).compile();
    service = unit;
  });

  it('should return vdc model with vdc detail model and Vdc details result dto ', async () => {
    const servicName = 'TEST_SERVICE';
    const daysLeft = 44;
    const status = ServiceStatusEnum.Success;
    const servicePlanType = ServicePlanTypeEnum.Static;

    const vdcDetailModels = getVdcDetailModel();
    const res: VdcDetailsResultDto = new VdcDetailsResultDto();

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res.serviceName).toBe(vdcDetailModels[0].name);
    expect(res.daysLeft).toBe(vdcDetailModels[0].daysLeft);
    expect(res.status).toBe(vdcDetailModels[0].status);
    expect(res.servicePlanType).toBe(vdcDetailModels[0].servicePlanType);

    expect(model.length).toBeGreaterThan(0);
    expect(model.length).toBe(vdcDetailModels.length);
  });

  it('should return null vdc model with null vdc detail model and null vdc details result dto ', async () => {
    const vdcDetailModels: VdcDetailModel[] = [];
    const res: VdcDetailsResultDto = new VdcDetailsResultDto();

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res.daysLeft).toBeUndefined();
    expect(res.serviceName).toBeUndefined();
    expect(res.status).toBeUndefined();
    expect(res.servicePlanType).toBe(undefined);
    expect(model).toHaveLength(0);
  });

  it('should return status of vdc item that have many options ', async () => {
    const res = {
      countOfNetworks: 3,
      countOfNat: 3,
      countOfFireWalls: 3,
      countOfIpSet: 3,
      countOfApplicationPort: { default: 0, custom: 0 },
      countOfNamedDisk: 3,
      countOfFiles: 3,
      statusOfDhcpForwarderStatus: true,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toHaveProperty('countOfNamedDisk');
    expect(model).toHaveProperty('countOfFiles');
    expect(model).toHaveProperty('statusOfDhcpForwarderStatus');
    expect(model).toHaveProperty('countOfFireWalls');
    expect(model.countOfNamedDisk).toBeGreaterThan(0);
    expect(model.countOfFiles).toBeGreaterThan(0);
    expect(model.countOfFireWalls).toBeGreaterThan(0);
  });

  it('should return status of vdc item that have no options ', async () => {
    const res = {
      countOfNetworks: 0,
      countOfNat: 0,
      countOfFireWalls: 0,
      countOfIpSet: 0,
      countOfApplicationPort: { default: 0, custom: 0 },
      countOfNamedDisk: 0,
      countOfFiles: 0,
      statusOfDhcpForwarderStatus: true,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toHaveProperty('countOfNamedDisk');
    expect(model).toHaveProperty('countOfFiles');
    expect(model).toHaveProperty('statusOfDhcpForwarderStatus');
    expect(model).toHaveProperty('countOfFireWalls');
    expect(model.countOfNamedDisk).toBe(0);
    expect(model.countOfFiles).toBe(0);
    expect(model.countOfFireWalls).toBe(0);
  });

  it('should not return status of vdc item with invalid instance id', async () => {
    const res = {
      countOfNetworks: undefined,
      countOfNat: undefined,
      countOfFireWalls: undefined,
      countOfIpSet: undefined,
      countOfApplicationPort: { default: undefined, custom: undefined },
      countOfNamedDisk: undefined,
      countOfFiles: undefined,
      statusOfDhcpForwarderStatus: undefined,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == inValidServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toBeUndefined();
  });
});
