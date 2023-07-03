import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * delete vm by given id
 * @param {String} authToken
 * @param {String} vAppId
 */
export async function userDeletevApp(authToken, vAppId) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vmId: vAppId },
  };
  const deletedVapp = await new VcloudWrapper().posts(
    'user.vm.deleteVm',
    options,
  );
  return Promise.resolve({
    __vcloudTask: deletedVapp.headers['location'],
  });
}