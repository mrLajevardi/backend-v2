export interface GetAvailableIPAddressesDto {
  values: GetAvailableIPAddressesValues[];
}
interface GetAvailableIPAddressesValues {
  gateway: string;
  prefixLength: number;
  enabled: boolean;
  ipRanges: IPRanges;
  totalIpCount: number;
}
export interface IPRanges {
  values: Value[];
}

export interface Value {
  startAddress: string;
  endAddress: string;
}
