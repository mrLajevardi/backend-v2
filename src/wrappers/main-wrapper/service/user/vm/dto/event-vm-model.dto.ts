import { VmPowerStateEventEnum } from "../enum/vm-power-state-event.enum";

export interface EventVmDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: Value[];
}

export interface Value {
  eventId: string;
  description: string;
  operatingOrg: Actor;
  user: Actor;
  actor: Actor;
  eventEntity: Actor;
  taskId: null | string;
  taskCellId: null;
  cellId: null;
  eventType: string;
  // serviceNamespace: ServiceNamespace;
  eventStatus: EventStatus; // SUCCESS -- FAILURE
  timestamp: Date;
  external: boolean;
  additionalProperties: AdditionalProperties;
}

export interface Actor {
  name: string | null;
  id: string | null;
}

export interface AdditionalProperties {
  'vm.id': VMID | string;
  entity?: Entity;
  'org.id'?: string;
  'vdc.id'?: string;
  'vm.name': string;
  'vm.vcId'?: string;
  'vdc.name'?: string;
  'vm.moref'?: string;
  'vm.host.ip'?: string;
  'vm.vapp.id'?: VMID;
  'vm.vcpuCount'?: number;
  'vm.tpmPresent'?: boolean;
  'vm.description'?: string;
  // 'metadata.system'?: MetadataSystem;
  'vm.cpuResourceMhz'?: number;
  'vm.storageProfile.id'?: VMID;
  'vm.memoryAllocationMb'?: number;
  'vm.storageAllocationMb'?: number;
  // 'vm.storageProfile.name'?: VMStorageProfileNameEnum;
  'vm.detected.guestOsType'?: string;
  'vm.configured.guestOsType'?: string;
  'vm.defaultStorageProfileName'?: null;
  'currentContext.user.proxyAddress': string;
  'currentContext.user.clientIpAddress': string;
  'vm.storageProfile.name.ARAD-Tier-Standard-Amin'?: number;
  'vm.state'?: VmPowerStateEventEnum;
}

export interface Entity {
  'vm.state'?: string;
  'vm.cpuShares'?: string;
  'vm.vcpuCount'?: string;
  'vm.cpuLimitMhz'?: string;
  'vm.memoryShares'?: string;
  'vm.memoryLimitMb'?: string;
  'vm.cpuResourceMhz'?: string;
  'vm.cpuReservationMhz'?: string;
  'vm.vmSizingPolicy.id'?: string;
  'vm.memoryAllocationMb'?: string;
  'vm.memoryReservationMb'?: string;
  'vm.storageAllocationMb': string;
  'vm.vdcComputePolicy.id'?: string;
  'vm.vmPlacementPolicy.id'?: string;
  'vm.storageProfile.name.ARAD-Tier-Standard-Amin': string;
}

export interface VMID {
  id: string;
  name?: string;
  type?: string;
}

// export enum Type {
//   COMVmwareVcloudEntityVM = 'com.vmware.vcloud.entity.vm',
//   COMVmwareVcloudEntityVapp = 'com.vmware.vcloud.entity.vapp',
//   COMVmwareVcloudEntityVdcstorageProfile = 'com.vmware.vcloud.entity.vdcstorageProfile',
// }

export enum EventStatus {
  Success = 'SUCCESS',
}
