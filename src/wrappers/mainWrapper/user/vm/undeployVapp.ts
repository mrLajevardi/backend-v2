import xml2js from 'xml2js';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * take resources from vm
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction suspend, powerOff, shutdown(shutdown guest)
 * @return {Promise}
 */
export async function userUndeployvApp(authToken, vAppId, vAppAction) {
  const request = {
    'root:UndeployVAppParams': {
      $: {
        'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
      },
      'root:UndeployPowerAction': vAppAction,
    },
  };
  const builder = new xml2js.Builder();

  const xmlRequest = builder.buildObject(request);
  const options = {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
    body: xmlRequest,
  };
  const action = await new VcloudWrapper().posts('user.vm.undeployVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
