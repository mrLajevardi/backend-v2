const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
async function userGetVmAttachedNamedDisk(authToken, nameDiskID) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
  };

  const action = new VcloudWrapper().posts('user.vdc.vmAttachedNamedDisk', {
    ...options,
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {nameDiskID},
  });
  return action;
}
module.exports = userGetVmAttachedNamedDisk;
