import { VcloudMetadata } from '../type/vcloud-metadata.type';

interface Disk {
  itemTypeName: string;
  enabled: boolean;
}

interface Period {
  itemTypeName: string;
  price: number;
  unit: string;
  enabled: boolean;
}

interface Gen {
  name: string;
  enabled: boolean;
  cpuSpeed: number;
}

export class DatacenterDetails {
  name: string;
  diskList: Disk[];
  periodList: Period[];
  enabled: boolean;
  location: string;
  gens: Gen[];
  providers: string;
}

export class DiskList {
  itemTypeName: string;
  enabled: boolean;
}

export class PeriodList {
  itemTypeName: string;
  price: number;
  unit: string;
  enabled: boolean;
}

export class GenDto {
  name: string;
  enabled: boolean;
  cpuSpeed: VcloudMetadata;
}
