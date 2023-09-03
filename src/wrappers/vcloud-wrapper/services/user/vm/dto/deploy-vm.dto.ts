import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeployVmDto extends EndpointOptionsInterface {
  urlParams: DeployVmUrlParams;
  body: string;
}

interface DeployVmUrlParams {
  vmId: string;
}

export class DeployVmBody {
  'root:DeployVAppParams': DeployVAppParams;
}

class DeployVAppParams {
  $: DeployVAppParamsMetaData;
}
class DeployVAppParamsMetaData {
  'xmlns:root': string;
  forceCustomization: boolean;
}
