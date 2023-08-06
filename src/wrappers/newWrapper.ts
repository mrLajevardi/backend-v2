import { WrapperErrorException } from 'src/infrastructure/exceptions/wrapper-error.exception';
import * as lodash from 'lodash';
import axios, { AxiosResponse } from 'axios';
import { isNil } from 'lodash';
import {
  EndpointInterface,
  EndpointOptionsInterface,
} from './interfaces/endpoint.interface';

export class Wrapper {
  static baseUrl = '';
  /**
   * initialize endpoints object
   */
  httpsAgent: any;
  endPoints: any;
  errHandling: any;

  constructor(httpsAgent, endpoints, baseURL) {
    Wrapper.baseUrl = baseURL;
    this.httpsAgent = httpsAgent;
    this.endPoints = endpoints;
  }
  /**
   * this method converts path to real path and call request
   * path to method
   * options of a method
   */
  posts<T extends EndpointOptionsInterface, U = any>(
    path: string,
    options: T,
  ): Promise<AxiosResponse<U>> {
    console.log(this.endPoints, path);
    const existingEndPoint = lodash.get(this.endPoints, path);
    if (!isNil(existingEndPoint)) {
      const endpoint = existingEndPoint(options);
      console.log(endpoint);
      return this.request(endpoint);
    } else {
      throw new Error(`method [${path}] not found`);
    }
  }
  /**
   * endpoint object created by endpoint methods
   */
  private async request<T = any>(
    endpoint: Partial<EndpointInterface>,
  ): Promise<AxiosResponse<T>> {
    try {
      const additionalConfig = endpoint?.additionalConfig || {};
      const request: AxiosResponse<T> = await axios.request({
        url: endpoint.resource,
        httpsAgent: this.httpsAgent,
        method: endpoint.method,
        headers: endpoint.headers,
        baseURL: Wrapper.baseUrl,
        params: endpoint.params,
        data: endpoint.body || null,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        ...additionalConfig,
      });
      console.log(endpoint);
      return Promise.resolve(request);
    } catch (err) {
      console.dir(err);
      return Promise.reject(
        new WrapperErrorException(
          err.response.status,
          err.response?.data?.message,
          err.stack,
          err.response?.data?.minorErrorCode,
        ),
      );
    }
  }
}
