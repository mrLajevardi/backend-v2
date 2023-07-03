import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * powerOn vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userPowerOnvApp(authToken, vAppId) {
  const options = {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const action = await new VcloudWrapper().posts('user.vm.powerOnVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
