const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * suspend vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
async function userSuspendVapp(authToken, vAppId) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId: vAppId},
  };
  const action = await new VcloudWrapper().posts('user.vm.suspendVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
};
module.exports = userSuspendVapp;
