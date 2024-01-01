import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface InstallVmToolsDto extends EndpointOptionsInterface {
  urlParams: InstallVmToolsUrlParams;
}

interface InstallVmToolsUrlParams {
  vmId: string;
}
