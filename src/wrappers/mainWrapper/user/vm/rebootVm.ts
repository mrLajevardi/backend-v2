import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * reset vm
 * @param {String} authToken
 * @param {String} vmId
 * @return {Promise}
 */
export async function userRebootVm(authToken, vmId) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vmId },
  };
  const action = await new VcloudWrapper().posts('user.vm.rebootVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
module.exports = userRebootVm;
