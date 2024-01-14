import { VcloudAcceptEnum } from '../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
export function getTaskListEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/query`,
    params: {
      type: 'task',
      page: options.params.page,
      pageSize: options.params.pageSize,
      sortDesc: options.params.sortDesc,
    },
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
      'Content-Type': 'application/* +json',
      ...options.headers,
    },
  };
}
