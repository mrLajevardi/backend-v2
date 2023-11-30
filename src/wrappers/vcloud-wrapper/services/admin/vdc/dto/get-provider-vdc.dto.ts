import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetProviderVdcDto extends EndpointOptionsInterface {
  urlParams: GetProviderVdcUrlParams;
}

interface GetProviderVdcUrlParams {
  providerVdcId: string;
}
