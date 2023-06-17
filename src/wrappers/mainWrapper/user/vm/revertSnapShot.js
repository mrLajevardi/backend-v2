const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');

/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
async function userRevertSnapShot(authToken, vAppId) {
  const options = {
    urlParams: {vmId: vAppId},
    headers: {Authorization: `Bearer ${authToken}`},
  };

  const action = await new VcloudWrapper().posts('user.vm.revertSnapShot', {
    ...options,
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userRevertSnapShot;
