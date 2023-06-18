const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * get a single vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export function userGetVApp(authToken, vAppId) {
  const vApp = new VcloudWrapper().posts('user.vm.getVm', {
    urlParams: {vmId: vAppId},
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return vApp;
};

module.exports = userGetVApp;
