import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * discards suspend state if vm's state is suspend
 * @param {String} authToken
 * @param {String} vmId
 * @return {Promise}
 */
export async function userInstallVmTools(authToken, vmId) {
  const action = await new VcloudWrapper().posts('user.vm.installVmTools', {
    urlParams: { vmId: vmId },
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
