import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetProviderVdcMetadataDto extends EndpointOptionsInterface {
  urlParams: GetProviderVdcMetadataUrlParams;
}

interface GetProviderVdcMetadataUrlParams {
  providerVdcId: string;
}
