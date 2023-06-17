/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
function removeVmSnapShot(options = {}) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/removeAllSnapshots`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = removeVmSnapShot;
