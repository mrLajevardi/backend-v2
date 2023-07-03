import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @param {String} vAppAction
 * @return {Promise}
 */
export async function userGetVmAttachedNamedDisk(authToken, nameDiskID) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const action = new VcloudWrapper().posts('user.vdc.vmAttachedNamedDisk', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { nameDiskID },
  });
  return action;
}