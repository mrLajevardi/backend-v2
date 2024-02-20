import { AxiosResponse, Method } from 'axios';

export interface WrapperResourceInterface<
  Body,
  Header,
  Params,
  Configs = never,
> {
  params: Params;
  baseUrl: string;
  headers: Header;
  url: string;
  method: Method;
  additionalConfigs?: Configs;
  body: Body;
  exceptionHan: (error: Error) => Promise<Error>;
  request: <R>() => Promise<AxiosResponse<R>>;
}
