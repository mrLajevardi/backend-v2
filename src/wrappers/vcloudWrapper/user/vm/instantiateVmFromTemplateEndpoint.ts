import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function instantiateVmFromTemplateEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/vdc/${options.urlParams.vdcId}/action/instantiateVmFromTemplate`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
