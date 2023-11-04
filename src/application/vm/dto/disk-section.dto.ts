export class VmDiskSection {
    name?: any;
    iopLimit: number;
    diskIopsEnabled: boolean;
    unitNumber: number;
    busNumber: number;
    adapterType: AdapterType;
    isNamedDisk: boolean;
    shareable: boolean;
    sizeMb: number;
    diskId: string;
}

type AdapterType = {
    name: string;
    legacyId: number;
}

// export class VmDiskSection {
//     diskSection: DiskSection[];
// }
  
  
  
  