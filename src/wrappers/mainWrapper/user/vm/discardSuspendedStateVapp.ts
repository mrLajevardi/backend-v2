import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * discards suspend state if vm's state is suspend
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userDiscardSuspendedStatevApp(authToken, vAppId) {
  const action = await new VcloudWrapper().posts('user.vm.discardSuspendVm', {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}