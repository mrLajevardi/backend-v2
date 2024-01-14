import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @param {Object} options.fullUrl
 * @return {Object}
 */
export function updateVdcStorageProfileEndpoint(options?: any) {
  return {
    method: 'put',
    resource: options.fullUrl,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
