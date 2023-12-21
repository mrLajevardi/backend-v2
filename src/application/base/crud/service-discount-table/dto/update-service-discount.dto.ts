export class UpdateServiceDiscountDto {
  serviceInstanceId?: string | null;
  percent?: number | null;
  price?: number | null;
  duration?: number | null;
  activateDate?: Date | null;
  enabled?: boolean | null;
}
