import { AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export interface EndpointInterface {
  method: string;
  resource: string;
  params: ;
  body: object;
  headers: Partial<AxiosRequestHeaders>;
  additionalConfigs: AxiosRequestConfig;
}

const x: EndpointInterface = {
  method: '',
  resource: '',
  params: {},
  body: {},
  headers: {
  },
  additionalConfigs: {
    ma
  }
};
