import { VcloudMetadata } from "../type/vcloud-metadata.type";

type gensList = {
    name: string;
    id: string;
    enabled: boolean;
    cpuSpeed: VcloudMetadata;
}

export class DataCenterList{
    datacenter: VcloudMetadata;
    gens: gensList[];
    datacenterTitle: VcloudMetadata;
    enabled: boolean;
    location: string;
    number: number;
}