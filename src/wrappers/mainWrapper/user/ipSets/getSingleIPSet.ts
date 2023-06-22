import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} ipSetId
 * @return {Promise}
 */
export async function userGetSingleIPSet(authToken, ipSetId) {
  const ipSet = await new VcloudWrapper().posts('user.ipSets.getIpSets', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { ipSetId },
  });
  return Promise.resolve(ipSet.data);
}

module.exports = userGetSingleIPSet;
