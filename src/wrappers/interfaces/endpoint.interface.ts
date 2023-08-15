import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export interface EndpointInterface {
  method: string;
  resource: string;
  params: object;
  body: object;
  headers: Partial<RawAxiosRequestHeaders>;
  additionalConfig?: Partial<AxiosRequestConfig>;
}

export interface EndpointOptionsInterface {
  params?: any;
  body?: any;
  urlParams?: any;
  headers?: Partial<RawAxiosRequestHeaders>;
  additionalConfigs?: Partial<AxiosRequestConfig>;
}
