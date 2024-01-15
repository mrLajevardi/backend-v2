import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function getApplicationPortProfileEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
    params: options.params,
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
