import { WrapperErrorException } from 'src/infrastructure/exceptions/wrapper-error.exception';
import * as lodash from 'lodash';
import axios, { AxiosResponse } from 'axios';
import { EndpointInterface } from './interfaces/endpoint.interface';

export class Wrapper<T> {
  baseUrl: string;
  /**
   * initialize endpoints object
   */
  httpsAgent: any;
  endPoints: T;
  errHandling: any;

  constructor(httpsAgent: object, endpoints: T, baseURL: string) {
    this.baseUrl = baseURL;
    this.httpsAgent = httpsAgent;
    this.endPoints = endpoints;
  }
  /**
   * this method converts path to real path
   */
  public getWrapper<T1 extends string>(path: T1): lodash.GetFieldType<T, T1> {
    const existingEndPoint = lodash.get<T, T1>(this.endPoints, path);
    return existingEndPoint;
  }
  /**
   * endpoint object created by endpoint methods
   */
  public async request<U, Header = any>(
    endpoint: EndpointInterface,
  ): Promise<AxiosResponse<U, Header>> {
    axios.defaults.withCredentials = true;
    try {
      const additionalConfig = endpoint?.additionalConfig || {};
      const request: AxiosResponse<U, Header> = await axios.request({
        url: endpoint.resource,
        httpsAgent: this.httpsAgent,
        method: endpoint.method,
        headers: endpoint.headers,
        baseURL: this.baseUrl,
        params: endpoint.params,
        data: endpoint.body || null,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        ...additionalConfig,
      });
      return Promise.resolve(request);
    } catch (err) {
      console.log(err);
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
