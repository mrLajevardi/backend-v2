import {getAccept} from "../../../../infrastructure/helpers/get-accept.helper";
import {VcloudAcceptEnum} from "../../../../infrastructure/enum/vcloud-accept.enum";

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @return {Object}
 */
export function createUserSessionEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/sessions`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
