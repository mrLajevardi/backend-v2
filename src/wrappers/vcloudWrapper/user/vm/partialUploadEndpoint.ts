import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function partialUploadEndpoint(options?: any) {
  return {
    method: 'put',
    resource: options.urlParams.fullAddress,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/octet-stream',
      ...options.headers,
    },
    additionalConfig: {
      maxRedirects: 0,
    },
  };
}
