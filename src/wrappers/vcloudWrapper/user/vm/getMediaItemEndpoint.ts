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
export function getMediaItemEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/media/${options.urlParams.mediaItemId}`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
