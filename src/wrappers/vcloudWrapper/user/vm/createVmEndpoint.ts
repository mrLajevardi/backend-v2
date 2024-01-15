import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function createVmEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/vdc/${options.urlParams.vdcId}/action/createVm`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
