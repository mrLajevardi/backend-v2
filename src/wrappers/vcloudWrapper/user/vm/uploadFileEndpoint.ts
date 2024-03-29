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
export function uploadFileEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/catalog/${options.urlParams.catalogId}/action/upload`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/vnd.vmware.vcloud.media+json;charset=UTF-8',
      ...options.headers,
    },
  };
}
