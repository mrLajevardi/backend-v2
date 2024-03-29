import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function updateApplicationPortProfilesEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      ...options.headers,
    },
  };
}
