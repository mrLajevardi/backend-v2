import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getVdcComputePolicyEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/2.0.0/vdcs/${options.urlParams.vdcId}/computePolicies`,
    params: options.params,
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
