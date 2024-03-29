import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

/**
 *
 * @param {String} authToken
 * @param {String} nameDiskID
 * @return {Promise}
 */
export async function userRemoveNamedDisk(authToken, nameDiskID) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const action = await new VcloudWrapper().posts('user.vdc.removeNamedDisk', {
    ...options,
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { nameDiskID },
  });
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
}
