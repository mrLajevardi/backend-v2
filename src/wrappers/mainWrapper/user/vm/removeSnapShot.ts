import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
export async function userRemoveSnapShot(authToken, vAppId) {
  const options = {
    urlParams: { vmId: vAppId },
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const action = await new VcloudWrapper().posts('user.vm.removeSnapShot', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
