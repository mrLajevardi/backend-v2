/**
 * delete a nat rule by given id
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function deleteNatEndpoint(options?: any) {
  return {
    method: 'delete',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules/${options.urlParams.natId}`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
