import { WrapperErrorException } from 'src/infrastructure/exceptions/wrapper-error.exception';

import * as lodash from 'lodash';
import axios from 'axios';
import { isNil } from 'lodash';

//const HttpExceptions = require('../exceptions/httpExceptions');
export class Wrapper {
  static baseUrl = '';
  /**
   * initialize endpoints object
   */

  httpsAgent: any;
  endPoints: any;
  errHandling: any;

  constructor(httpsAgent, endpoints, baseURL, errHandling = 'vcloud') {
    Wrapper.baseUrl = baseURL;
    this.httpsAgent = httpsAgent;
    this.endPoints = endpoints;
    this.errHandling = errHandling;
  }
  /**
   * this method converts path to real path and call request
   * @param {String} path path to method
   * @param {Object} options options of a method
   * @return {Promise}
   */
  posts(path = '', options = {}) {
    console.log(this.endPoints, path);
    const existingEndPoint = lodash.get(this.endPoints, path);
    if (!isNil(existingEndPoint)) {
      const endpoint = existingEndPoint(options);
      console.log(endpoint);
      return this.#request(endpoint);
    } else {
      throw new Error(`method [${path}] not found`);
    }
  }
  /**
   * @param {Object} endpoint endpoint object created by endpoint methods
   * @return {Promise}
   */
  async #request(endpoint: any) {
    try {
      const additionalConfig = endpoint?.additionalConfig || {};
      const request = await axios.request({
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
        onUploadProgress: (progressEvent) =>
          console.log('file progress', progressEvent.loaded),
      });
      console.log(endpoint);
      return Promise.resolve(request);
    } catch (err) {
      // console.dir(err);
      console.log(err.stack, '🥚');
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
