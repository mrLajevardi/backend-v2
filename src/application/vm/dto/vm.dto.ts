export class VmSupportedHardDiskAdaptors {
    id: string;
    busNumberRanges: BusNumberRange[];
    legacyId: number;
    name: string;
    reservedBusUnitNumber?: any;
    unitNumberRanges: BusNumberRange[];
}
interface BusNumberRange {
    begin: number;
    end: number;
}
  
  