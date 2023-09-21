import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';

@Injectable()
export class InvoiceFactory {
  constructor(private readonly itemTypesTableService: ItemTypesTableService) {}
  async validateVdcInvoice(invoice: CreateServiceInvoiceDto): Promise<void> {
    for (const invoiceItem of invoice.itemsTypes) {
      const targetInvoiceItem = await this.itemTypesTableService.findById(
        invoiceItem.itemTypeId,
      );
      if (!targetInvoiceItem) {
        throw new BadRequestException();
      }
      // check item is the last child
      const isParent = await this.itemTypesTableService.findOne({
        where: {
          parentId: targetInvoiceItem.id,
        },
      });
    }
  }
}
