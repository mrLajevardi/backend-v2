import { InvoiceDetailVdcModel } from '../interface/invoice-detail-vdc.interface';
import { InvoiceItems } from '../../../../infrastructure/database/entities/InvoiceItems';
import { ServiceItemTypesTree } from '../../../../infrastructure/database/entities/views/service-item-types-tree';
import {
  DiskItemCodes,
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { VdcInvoiceDetailsResultDto } from '../../../vdc/dto/vdc-invoice-details.result.dto';
import { VdcInvoiceDetailsInfoResultDto } from '../../../vdc/dto/vdc-invoice-details-info.result.dto';
import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ServiceTypes } from '../../../../infrastructure/database/entities/ServiceTypes';
import { isNil } from 'lodash';
import { NotFoundDataException } from '../../../../infrastructure/exceptions/not-found-data-exception';
import { BaseFactoryException } from '../../../../infrastructure/exceptions/base/base-factory.exception';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';

@Injectable()
export class InvoiceFactoryVdcService {
  constructor(
    private readonly invoicesTable: InvoicesTableService,
    private readonly baseFactoryException: BaseFactoryException,
  ) {}

  async getVdcInvoiceDetailModel(
    invoiceId: string,
    serviceTypeWhere = 'vdc',
  ): Promise<InvoiceDetailVdcModel[]> {
    // const serviceTypeWhere = 'vdc';
    // serviceTypeWhere = 'vdc';
    // const invoiceModels: any[] = [];

    const invoiceModels = await this.invoicesTable
      .getQueryBuilder()
      .select(
        `Invoice.RawAmount , Invoice.FinalAmount , Invoice.DateTime , Invoice.TemplateID , Invoice.BaseAmount
         , Invoice.Code as InvoiceCode , 
        Invoice.ServiceCost , Invoice.InvoiceTax `,
      )
      .where(
        'Invoice.ServiceTypeID = :serviceTypeId AND Invoice.ID= :invoiceId ',
        {
          invoiceId: invoiceId,
          serviceTypeId: serviceTypeWhere,
        },
      )
      .innerJoin(
        InvoiceItems,
        'InvoiceItem',
        'InvoiceItem.InvoiceID = Invoice.ID',
      )
      .addSelect('InvoiceItem.Value , InvoiceItem.ItemID , InvoiceItem.Fee ')
      .innerJoin(ServiceItemTypesTree, 'SIT', 'SIT.ID = InvoiceItem.ItemID')
      .addSelect(
        'SIT.CodeHierarchy ,SIT.DatacenterName , SIT.Code , SIT.Title , SIT.Unit , SIT.Min , SIT.Max , SIT.Price , SIT.Percent ',
      )
      .innerJoin(
        ServiceTypes,
        'ST',
        `ST.ID = N'${serviceTypeWhere}'  AND  ST.DatacenterName = SIT.DatacenterName `,
      )
      .addSelect(`ST.Title as DatacenterTitle`)
      .getRawMany();

    if (isNil(invoiceModels) || invoiceModels.length == 0) {
      console.error(
        `Not Found invoiceItems about invoiceId : ${invoiceId} or something about it`,
      );
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const res = invoiceModels.map((model) => {
      const res: InvoiceDetailVdcModel = {
        code: model.Code,
        value: model.Value,
        codeHierarchy: model.CodeHierarchy,
        title: model.Title,
        datacenterName: model.DatacenterName,
        fee: model.Fee,
        rawAmount: model.RawAmount,
        finalAmount: model.FinalAmount,
        dateTime: model.DateTime,
        itemID: model.ItemID,
        parentCode: '',
        unit: model.Unit,
        max: model.Max,
        min: model.Min,
        price: model.Price,
        templateId: model.TemplateID,
        datacenterTitle: model.DatacenterTitle,
        percent: model.Percent,
        baseAmount: model.BaseAmount,
        invoiceCode: model.InvoiceCode,
        invoiceTax: model.InvoiceTax,
        serviceCost: model.ServiceCost,
      };

      return res;
    });
    return res;
  }

  getVdcInvoiceItemType(
    vdcInvoiceModels: InvoiceDetailVdcModel[],
    itemTypeCodes: ItemTypeCodes,
  ): InvoiceDetailVdcModel {
    const reservationRam = vdcInvoiceModels.find((model) =>
      model.codeHierarchy.includes(itemTypeCodes),
    );
    return reservationRam;
  }

  getVdcInvoiceItemModel(
    vdcInvoiceModels: InvoiceDetailVdcModel[],
    vdcGenerationItemCodes: VdcGenerationItemCodes,
  ): InvoiceDetailVdcModel | InvoiceDetailVdcModel[] {
    if (vdcGenerationItemCodes == VdcGenerationItemCodes.Disk) {
      return vdcInvoiceModels.filter((model) =>
        model.codeHierarchy.includes(vdcGenerationItemCodes),
      );
    }

    return vdcInvoiceModels.find((model) =>
      model.codeHierarchy.includes(vdcGenerationItemCodes.toLowerCase()),
    );
  }

  getVdcInvoiceDetailInfo(vdcInvoiceModels: InvoiceDetailVdcModel[]) {
    const cpuModel = this.getVdcInvoiceItemModel(
      vdcInvoiceModels,
      VdcGenerationItemCodes.Cpu,
    );

    const ramModel = this.getVdcInvoiceItemModel(
      vdcInvoiceModels,
      VdcGenerationItemCodes.Ram,
    );

    const diskModel = this.getVdcInvoiceItemModel(
      vdcInvoiceModels,
      VdcGenerationItemCodes.Disk,
    );

    const ipModel = this.getVdcInvoiceItemModel(
      vdcInvoiceModels,
      VdcGenerationItemCodes.Ip,
    );

    const vmModel = this.getVdcInvoiceItemModel(
      vdcInvoiceModels,
      VdcGenerationItemCodes.Vm,
    );

    const generation = (ramModel as InvoiceDetailVdcModel).codeHierarchy.split(
      '_',
    )[1]; // 1 ==>  Index of Generation !! ;

    const reservationRam = this.getVdcInvoiceItemType(
      vdcInvoiceModels,
      ItemTypeCodes.MemoryReservation,
    );
    // .code.toUpperCase();

    const reservationCpu = this.getVdcInvoiceItemType(
      vdcInvoiceModels,
      ItemTypeCodes.CpuReservation,
    );

    const period = this.getVdcInvoiceItemType(
      vdcInvoiceModels,
      ItemTypeCodes.Period,
    );

    const guaranty = this.getVdcInvoiceItemType(
      vdcInvoiceModels,
      ItemTypeCodes.Guaranty,
    );

    return {
      cpuModel,
      ramModel,
      diskModel,
      ipModel,
      vmModel,
      generation,
      reservationRam,
      reservationCpu,
      period,
      guaranty,
    };
  }

  fillRes(
    res: VdcInvoiceDetailsResultDto,
    cpuModel: InvoiceDetailVdcModel,
    ramModel: InvoiceDetailVdcModel,
    diskModel: InvoiceDetailVdcModel[],
    ipModel: InvoiceDetailVdcModel,
    generation: string,
    reservationCpu: InvoiceDetailVdcModel,
    reservationRam: InvoiceDetailVdcModel,
    vmModel: InvoiceDetailVdcModel,
    guaranty: InvoiceDetailVdcModel,
    period: InvoiceDetailVdcModel,
  ) {
    res.cpu = new VdcInvoiceDetailsInfoResultDto(cpuModel);

    res.ram = new VdcInvoiceDetailsInfoResultDto(ramModel);
    res.ram.value = (Number(res.ram.value) * 1024).toString();

    const swapdisk = diskModel.find(
      (disk) => disk.code.toLowerCase().trim() == DiskItemCodes.Swap,
    );

    res.ip = new VdcInvoiceDetailsInfoResultDto(ipModel);

    res.generation = generation;

    res.reservationCpu = `${Number(reservationCpu.value)}`;

    res.reservationRam = `${Number(reservationRam.value)}`;

    res.vm = new VdcInvoiceDetailsInfoResultDto(vmModel);

    res.disk = this.calcDiskInvoice(diskModel, swapdisk);

    res.datacenter = {
      title: vmModel.datacenterTitle,
      name: vmModel.datacenterName,
    }; // TODO about DatacenterName and DatacenterTitle;

    // Math.round((item.fee ? item.fee : item.price) / 1000) * 1000
    res.finalPrice = Number(ramModel.finalAmount?.toFixed(0));

    res.finalPriceWithTax =
      res.finalPrice * ramModel.invoiceTax + res.finalPrice;

    res.finalPriceTax = res.finalPrice * ramModel.invoiceTax;

    res.rawAmount = Number(ramModel.rawAmount?.toFixed(0));

    res.rawAmountTax = res.rawAmount * ramModel.invoiceTax;

    res.rawAmountWithTax = res.rawAmount * ramModel.invoiceTax + res.rawAmount;

    res.guaranty = new VdcInvoiceDetailsInfoResultDto(guaranty);

    res.period = new VdcInvoiceDetailsInfoResultDto(period);

    res.templateId = ramModel.templateId;

    res.baseAmount = ramModel.baseAmount;

    res.serviceCost = ramModel.serviceCost;

    res.invoiceTax = ramModel.invoiceTax;

    // res.serviceCostTax = ramModel.serviceCost * ramModel.invoiceTax;
    res.serviceCostWithDiscount = !isNil(period)
      ? ramModel.serviceCost * period?.percent + ramModel.serviceCost
      : ramModel.serviceCost;
    if (res.templateId) {
      res.discountAmount = ramModel.rawAmount - ramModel.finalAmount;
    } else {
      res.discountAmount = res.serviceCost - res.serviceCostWithDiscount;
    }

    res.serviceCostTax = res.serviceCostWithDiscount * ramModel.invoiceTax;

    res.serviceCostFinal = res.serviceCostTax + res.serviceCostWithDiscount;

    res.serviceType = ServiceTypesEnum.Vdc;
  }

  private calcDiskInvoice(
    diskModel: InvoiceDetailVdcModel[],
    swapDisk: InvoiceDetailVdcModel,
  ): VdcInvoiceDetailsInfoResultDto[] {
    return diskModel
      .map((diskmodel) => {
        if (diskmodel.code.trim() !== DiskItemCodes.Swap) {
          if (diskmodel.code.toLowerCase().trim() == DiskItemCodes.Standard) {
            diskmodel.fee += swapDisk.fee;
          }

          const res: VdcInvoiceDetailsInfoResultDto =
            new VdcInvoiceDetailsInfoResultDto(diskmodel);
          return res;
        }
      })
      .filter((disk) => disk != null);
  }
}
