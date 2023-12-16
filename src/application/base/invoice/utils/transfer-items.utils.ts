import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';

export const transferItems = function (
  serviceItems: ServiceItems[],
): InvoiceItemsDto[] {
  const transformedItems = serviceItems.map((item) => {
    const invoiceItem: InvoiceItemsDto = {
      itemTypeId: item.itemTypeId,
      value: item.value,
    };
    return invoiceItem;
  });
  return transformedItems;
};
