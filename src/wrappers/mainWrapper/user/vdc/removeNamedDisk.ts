const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');

/**
 *
 * @param {String} authToken
 * @param {String} nameDiskID
 * @return {Promise}
 */
async function userRemoveNamedDisk(authToken, nameDiskID) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
  };

  const action = await new VcloudWrapper().posts('user.vdc.removeNamedDisk', {
    ...options,
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {nameDiskID},
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userRemoveNamedDisk;
