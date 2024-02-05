import { Method, RawAxiosRequestHeaders } from 'axios';
import { WrapperResourceInterface } from './wrapper-resource.interface';

export interface WrapperBuilderInterface<
  B = unknown,
  P = unknown,
  H = unknown,
  C = unknown,
> {
  resource: WrapperResourceInterface<B, H, P, C>;
  setMethod(method: Method): this;
  setUrl(url: string): this;
  setBody<T>(body: T): WrapperBuilderInterface<B & T, P, H, C>;
  setHeaders<T extends RawAxiosRequestHeaders>(
    headers: T,
  ): WrapperBuilderInterface<B, P, H & T, C>;
  setParams<T>(params: T): WrapperBuilderInterface<B, P & T, H, C>;
  setAdditionalConfigs<T>(configs: T): WrapperBuilderInterface<B, P, H, C & T>;
  setBaseUrl(baseUrl: string): this;
  setDefault(): this;
  setException(exception: (error: Error) => Promise<Error>): this;
  reset(): this;
  build(): WrapperResourceInterface<B, H, P, C>;
}
