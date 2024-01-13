/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function acquireVmTicketEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/screen/action/acquireMksTicket`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
