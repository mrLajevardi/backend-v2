const xml2js = require('xml2js');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const builder = new xml2js.Builder();
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {Object} snapShotProperties
 * @return {Promise}
 */
export async function userCreateSnapShot(authToken, vAppId, snapShotProperties) {
  const request = {
    'root:CreateSnapshotParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        'memory': snapShotProperties.memory,
        'quiesce': snapShotProperties.quiesce,
      },
    },
  };
  const xmlRequest = builder.buildObject(request);
  const options = {
    urlParams: {vmId: vAppId},
    headers: {Authorization: `Bearer ${authToken}`},
    body: xmlRequest,
  };

  const action = await new VcloudWrapper().posts('user.vm.createSnapShot', {
    ...options,
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userCreateSnapShot;
