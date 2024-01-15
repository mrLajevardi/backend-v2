import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function revertVmSnapShot(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/revertToCurrentSnapshot`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
