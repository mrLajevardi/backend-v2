import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateVmDto extends EndpointOptionsInterface {
  urlParams: CreateVmUrlParams;
  body: CreateVmBody;
}

interface CreateVmUrlParams {
  vdcId: string;
}

class CreateVmBody {
  'root:InstantiateVmTemplateParams': InstantiateVmTemplateParams;
}

class InstantiateVmTemplateParams {
  $: InstantiateVmTemplateParamsMetadata;
  'root:Description': string;
  'root:SourcedVmTemplateItem': SourcedVmTemplateItem;
  'root:AllEULAsAccepted': boolean;
  'root:ComputePolicy': ComputePolicy;
}

class InstantiateVmTemplateParamsMetadata {
  'xmlns:root': string;
  'xmlns:ns0': string;
  name: string;
  powerOn: boolean;
}
class SourcedVmTemplateItem {
  'root:Source': Source;
  'root:VmTemplateInstantiationParams': VmTemplateInstantiationParams;
  'root:StorageProfile': StorageProfile;
}

class Source {
  $: SourceMetadata;
}

class SourceMetadata {
  href: string;
  id: string;
  name: string;
  type: string;
}

class VmTemplateInstantiationParams {
  'root:NetworkConnectionSection': NetworkConnectionSection;
  'root:GuestCustomizationSection': GuestCustomizationSection;
}

class NetworkConnectionSection {
  'ns0:Info': string;
  'root:PrimaryNetworkConnectionIndex': number;
  'root:NetworkConnection': NetworkConnection[];
}

class NetworkConnection {
  'root:NetworkConnectionIndex': number;
  'root:IpAddress': string;
  'root:IsConnected': boolean;
  'root:IpAddressAllocationMode': string;
  'root:NetworkAdapterType': string;
}
class GuestCustomizationSection {
  'ns0:Info:': string;
  'root:Enabled': boolean;
  'root:AdminPasswordAuto': boolean;
  'root:ComputerName': string;
}

class StorageProfile {
  $: StorageProfileMetadata;
}

class StorageProfileMetadata {
  href: string;
  type: string;
}

class ComputePolicy {
  'root:VmSizingPolicy': VmSizingPolicy;
}

class VmSizingPolicy {
  $: VmSizingPolicyMetadata;
}

class VmSizingPolicyMetadata {
  href: string;
  id: string;
}
