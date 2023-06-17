const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
async function userDettachNamedDisk(authToken, nameDiskID, vmID) {
  const request = {
    disk: {
      href: `https://vcd.aradcloud.com/api/disk/${nameDiskID}`,
      type: 'application/vnd.vmware.vcloud.disk+xml',
    },
  };

  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    body: request,
  };

  const action = await new VcloudWrapper().posts('user.vdc.dettachNamedDisk', {
    ...options,
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmID},
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userDettachNamedDisk;
