import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function updateVdcEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/api/admin/vdc/${options.urlParams.vdcId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
