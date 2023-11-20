import { InvoiceDetailVdcModel } from '../interface/invoice-detail-vdc.interface';
import { InvoiceItems } from '../../../../infrastructure/database/entities/InvoiceItems';
import { ServiceItemTypesTree } from '../../../../infrastructure/database/entities/views/service-item-types-tree';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { VdcInvoiceDetailsResultDto } from '../../../vdc/dto/vdc-invoice-details.result.dto';
import { VdcInvoiceDetailsInfoResultDto } from '../../../vdc/dto/vdc-invoice-details-info.result.dto';
import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';

@Injectable()
export class InvoiceFactoryVdcService {
  constructor(private readonly invoicesTable: InvoicesTableService) {}
  async getVdcInvoiceDetailModel(
    invoiceId: string,
  ): Promise<InvoiceDetailVdcModel[]> {
    const serviceTypeWhere = 'vdc';

    // const invoiceModels: any[] = [];

    const invoiceModels = await this.invoicesTable
      .getQueryBuilder()
      .select(
        'Invoice.RawAmount , Invoice.FinalAmount , Invoice.DateTime , Invoice.TemplateID',
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
        'SIT.CodeHierarchy ,SIT.DatacenterName , SIT.Code , SIT.Title , SIT.Unit , SIT.Min , SIT.Max , SIT.Price ',
      )
      .getRawMany();

    return invoiceModels.map((model) => {
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
      };

      return res;
    });
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

    res.disk = diskModel
      .map((diskmodel) => {
        if (diskmodel.code.trim() !== 'swap') {
          const res: VdcInvoiceDetailsInfoResultDto =
            new VdcInvoiceDetailsInfoResultDto(diskmodel);
          return res;
        }
      })
      .filter((disk) => disk != null);

    res.ip = new VdcInvoiceDetailsInfoResultDto(ipModel);

    res.generation = generation;

    res.reservationCpu = `${Number(reservationCpu.value) * 100}${
      reservationCpu.unit
    } vCPU`;

    res.reservationRam = `${Number(reservationCpu.value) * 100}${
      reservationCpu.unit
    } RAM`;

    res.vm = new VdcInvoiceDetailsInfoResultDto(vmModel);

    res.datacenter = {
      title: vmModel.datacenterName,
      name: vmModel.datacenterName,
    }; // TODO about DatacenterName and DatacenterTitle;

    res.finalPrice = ramModel.finalAmount;

    res.rawAmount = ramModel.rawAmount;

    res.guaranty = new VdcInvoiceDetailsInfoResultDto(guaranty);

    res.period = new VdcInvoiceDetailsInfoResultDto(period);

    res.templateId = ramModel.templateId;

    // res.period = { title: period.title, value: period.min };
  }
}
