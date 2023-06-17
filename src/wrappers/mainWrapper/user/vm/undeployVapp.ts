const xml2js = require('xml2js');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const builder = new xml2js.Builder();
/**
 * take resources from vm
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction suspend, powerOff, shutdown(shutdown guest)
 * @return {Promise}
 */
async function userUndeployvApp(authToken, vAppId, vAppAction) {
  const request = {
    'root:UndeployVAppParams': {
      '$': {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
      },
      'root:UndeployPowerAction': vAppAction,
    },
  };
  const xmlRequest = builder.buildObject(request);
  const options = {
    urlParams: {vmId: vAppId},
    headers: {Authorization: `Bearer ${authToken}`},
    body: xmlRequest,
  };
  const action = await new VcloudWrapper().posts('user.vm.undeployVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
};
module.exports = userUndeployvApp;
