import {
  HardDiskAdapter,
  ID,
  Range,
  ReservedBusUnitNumber,
} from '../../vdc/dto/get-hard-disk-adaptors.dto';

export interface UpdateDiskSectionDto {
  adapterType: number;
  diskId: string | null;
  sizeMb: number;
  unitNumber?: number;
  busNumber: number;
}

export interface Combinations {
  '4': Combination[];
  '6': Combination[];
  '7': Combination[];
  '1': Combination[];
}

interface Combination {
  busNumber: number;
  unitNumber: number;
}

export interface GetHardDiskControllersDto {
  [key: string]: DiskAdaptor;
}

export interface DiskAdaptor {
  busNumberRanges: AdapterRange[];
  unitNumberRanges: AdapterRange[];
  legacyId: number;
  id: ID;
  name: string;
  reservedBusUnitNumber: ReservedBusUnitNumber;
}

export interface AdapterRange {
  begin: number;
  end: number;
}
