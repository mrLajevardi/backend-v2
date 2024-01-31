export class InvoiceCalculatorAmountDto {
  baseAmount: number;
  finalAmount: number;
  rawAmount: number;
}

export interface CalculationInvoiceItemsType {
  ItemID: number;
  Fee: number;
  value: string | undefined | null;
  codeHierarchy: string;
}
