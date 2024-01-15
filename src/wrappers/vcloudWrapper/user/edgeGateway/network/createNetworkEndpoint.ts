import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function createNetworkEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/orgVdcNetworks`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
