import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export interface EndpointInterface {
  method: string;
  resource: string;
  params: object;
  body: object | string;
  headers: Partial<RawAxiosRequestHeaders>;
  additionalConfig?: Partial<AxiosRequestConfig>;
}

export interface EndpointOptionsInterface {
  params?: object;
  body?: object;
  urlParams?: object;
  headers?: Partial<RawAxiosRequestHeaders>;
  additionalConfigs?: Partial<AxiosRequestConfig>;
}
