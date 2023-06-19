import { xml2js } from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
const builder = new xml2js.Builder();
/**
 * powerOn vm and force recustomization
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userDeployvApp(authToken, vAppId) {
  const request = {
    'root:DeployVAppParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        forceCustomization: true,
      },
    },
  };
  const xmlRequest = builder.buildObject(request);
  const action = await new VcloudWrapper().posts('user.vm.deployVm', {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userDeployvApp;
