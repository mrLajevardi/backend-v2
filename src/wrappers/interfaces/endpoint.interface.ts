import { AxiosRequestConfig, Method, RawAxiosRequestHeaders } from 'axios';

export interface EndpointInterface {
  method: string;
  resource: string;
  params: object;
  body: object | string;
  headers: Partial<RawAxiosRequestHeaders>;
  additionalConfig?: Partial<AxiosRequestConfig>;
}

export interface EndpointOptionsInterface {
  headers?: Partial<RawAxiosRequestHeaders>;
  additionalConfigs?: Partial<AxiosRequestConfig>;
}
