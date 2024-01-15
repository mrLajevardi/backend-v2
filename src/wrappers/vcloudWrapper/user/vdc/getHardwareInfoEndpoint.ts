import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getHardwareInfoEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/vdc/${options.urlParams.vdcId}/hwv/vmx-19`,
    params: options.params,
    body: null,
    headers: {
      'Content-Type': 'application/* +json;',
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      ...options.headers,
    },
  };
}
