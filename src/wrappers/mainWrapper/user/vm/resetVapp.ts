import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * reset vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userResetvApp(authToken, vAppId) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vmId: vAppId },
  };
  const action = await new VcloudWrapper().posts('user.vm.resetVm', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
