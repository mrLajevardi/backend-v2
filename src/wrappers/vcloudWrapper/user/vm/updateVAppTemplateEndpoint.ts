import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function updateVAppTemplateEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `api/vAppTemplate/${options.urlParams.templateId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
