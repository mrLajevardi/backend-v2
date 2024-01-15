import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @return {Object}
 */
export function createProviderSessionEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/sessions/provider`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
