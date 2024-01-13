import {getAccept} from "../../../../infrastructure/helpers/get-accept.helper";
import {VcloudAcceptEnum} from "../../../../infrastructure/enum/vcloud-accept.enum";

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function createUserEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/admin/org/${options.urlParams.orgId}/users`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
