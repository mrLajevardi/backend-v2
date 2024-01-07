import { VdcInvoiceService } from './vdc-invoice.service';
import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';
import { TestBed } from '@automock/jest';

describe('VdcInvoiceService', () => {
  let service: VdcInvoiceService;
  const validInvoiceId = '12345';
  const inValidInvoiceId = '1234asda5';
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fillTaxAndDiscountProperties() {},
    };
  }
  beforeEach(async () => {
    const { unit } = TestBed.create(VdcInvoiceService).compile();
    service = unit;
  });

  it('should return null vdc invoice detail with invalid invoice id ', async () => {
    const res: VdcInvoiceDetailsResultDto = new VdcInvoiceDetailsResultDto();

    const myMock = jest
      .spyOn(service, 'getVdcInvoiceDetail')
      .mockImplementation((invoiceId) => {
        if (invoiceId == inValidInvoiceId) return Promise.resolve(res);
      });
    const model = await service.getVdcInvoiceDetail(inValidInvoiceId);

    expect(model).toBe(res);
    expect(myMock).toHaveBeenCalledWith(inValidInvoiceId);
  });

  it('should return vdc invoice detail with valid invoice id', async () => {
    const res: VdcInvoiceDetailsResultDto = getValidVdcDetailsResultDto();

    const myMock = jest
      .spyOn(service, 'getVdcInvoiceDetail')
      .mockImplementation((invoiceId) => {
        if (invoiceId == validInvoiceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getVdcInvoiceDetail(validInvoiceId);

    expect(model).toBe(res);
    // expect(myMock).toHaveBeenCalled();
    expect(myMock).toHaveBeenCalledWith(validInvoiceId);
  });
});
