/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */

import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

export function deleteOrgCatalogEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/api/admin/catalog/${options.urlParams.catalogId}?recursive=true&force=true`,
    params: {},
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
