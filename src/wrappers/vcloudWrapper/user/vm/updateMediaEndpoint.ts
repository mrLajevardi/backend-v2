import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function updateMediaEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/api/media/${options.urlParams.mediaId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
