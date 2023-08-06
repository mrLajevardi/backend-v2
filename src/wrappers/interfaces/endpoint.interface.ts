import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export interface EndpointInterface {
  method: string;
  resource: string;
  params: object;
  body: object;
  headers: Partial<RawAxiosRequestHeaders>;
  additionalConfig: Partial<AxiosRequestConfig>;
}

export interface EndpointOptionsInterface {
  params: string;
  body: object;
  urlParams: object;
  additionalHeaders: Partial<RawAxiosRequestHeaders>;
  additionalConfigs: Partial<AxiosRequestConfig>;
}
