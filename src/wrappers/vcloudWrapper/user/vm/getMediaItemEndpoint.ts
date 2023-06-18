/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function getMediaItemEndpoint(options? : any) {
  return {
    method: 'get',
    resource: `/api/media/${options.urlParams.mediaItemId}`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = getMediaItemEndpoint;


