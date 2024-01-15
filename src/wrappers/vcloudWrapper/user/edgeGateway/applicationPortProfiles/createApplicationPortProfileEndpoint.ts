import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function createApplicationPortProfilesEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      ...options.headers,
    },
  };
}
