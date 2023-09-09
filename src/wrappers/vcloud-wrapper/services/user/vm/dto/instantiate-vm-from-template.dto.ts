import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface InstantiateVmFromTemplateDto extends EndpointOptionsInterface {
  urlParams: InstantiateVmFromTemplateUrlParams;
  body: string;
}

interface InstantiateVmFromTemplateUrlParams {
  vdcId: string;
}
