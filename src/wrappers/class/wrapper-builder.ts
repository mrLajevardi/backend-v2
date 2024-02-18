import axios, { AxiosResponse, Method, RawAxiosRequestHeaders } from 'axios';
import { WrapperBuilderInterface } from '../interfaces/wrapper-builder.interface';
import { WrapperResourceInterface } from '../interfaces/wrapper-resource.interface';
import * as https from 'https';
import { InternalServerErrorException } from '@nestjs/common';

export class WrapperBuilder<B = unknown, P = unknown, H = unknown, C = unknown>
  implements WrapperBuilderInterface<B, P, H, C>
{
  /** request configs */
  private _resource: WrapperResourceInterface<B, H, P, C>;

  get resource(): WrapperResourceInterface<B, H, P, C> {
    throw new InternalServerErrorException();
  }

  constructor() {
    this._resource = {} as WrapperResourceInterface<B, H, P, C>;
  }
  /**
   set additional configs to axios
   */
  setAdditionalConfigs<T>(configs: T): WrapperBuilder<B, P, H, C & T> {
    if (!this._resource.additionalConfigs) {
      this._resource.additionalConfigs = { ...configs } as unknown as C;
    }
    this._resource.additionalConfigs = {
      ...this._resource.additionalConfigs,
      ...configs,
    };
    return this as WrapperBuilder<B, P, H, C & T>;
  }
  /**
   set axios request body
   */
  setBody<T>(body: T): WrapperBuilder<B & T, P, H, C> {
    if (!this._resource.body) {
      this._resource.body = { ...body } as unknown as B;
      return this as WrapperBuilder<B & T, P, H, C>;
    }
    this._resource.body = {
      ...this._resource.body,
      ...body,
    };
    return this as WrapperBuilder<B & T, P, H, C>;
  }
  /** set headers  */
  setHeaders<T extends RawAxiosRequestHeaders>(
    headers: T,
  ): WrapperBuilder<B, P, H & T, C> {
    if (!this._resource.headers) {
      this._resource.headers = { ...headers } as unknown as H;
      return this as WrapperBuilder<B, P, H & T, C>;
    }
    this._resource.headers = {
      ...this._resource.headers,
      ...headers,
    };
    return this as WrapperBuilder<B, P, H & T, C>;
  }
  /** set method type eg: post */
  setMethod(method: Method): this {
    this._resource.method = method;
    return this;
  }
  /** set query params to request configs */
  setParams<T>(params: T): WrapperBuilder<B, P & T, H, C> {
    if (!this._resource.params) {
      this._resource.params = { ...params } as unknown as P;
      return this as WrapperBuilder<B, P & T, H, C>;
    }
    this._resource.params = {
      ...this._resource.params,
      ...params,
    };
    return this as WrapperBuilder<B, P & T, H, C>;
  }
  /** set url */
  setUrl(url: string): this {
    this._resource.url = url;
    return this;
  }
  setBaseUrl(baseUrl: string): this {
    this._resource.baseUrl = baseUrl;
    return this;
  }
  build(): WrapperResourceInterface<B, H, P, C> {
    this._resource.request = async function <T>(
      this: WrapperResourceInterface<B, H, P, C>,
    ): Promise<AxiosResponse<T>> {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      console.log(this);
      try {
        const additionalConfig = this.additionalConfigs ?? {};
        const t = {
          url: this.url,
          httpsAgent: httpsAgent,
          method: this.method,
          headers: this.headers as RawAxiosRequestHeaders,
          baseURL: this.baseUrl,
          params: this.params,
          data: this.body ?? null,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          ...additionalConfig,
        };
        const request = await axios.request<T>(t);
        return Promise.resolve(request);
      } catch (err) {
        await this.exceptionHan(err);
      }
    };
    const resource = this._resource;
    this.reset();
    return resource;
  }

  setException(exception: (error: Error) => Promise<Error>): this {
    this._resource.exceptionHan = exception;

    return this;
  }

  setDefault(): this {
    return this;
  }

  reset(): this {
    this._resource = {} as WrapperResourceInterface<B, H, P, C>;
    return this;
  }
}
