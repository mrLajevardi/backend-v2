const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {String} ipSetId
 * @return {Promise}
 */
export async function userDeleteIPSet(authToken, ipSetId) {
  const options = {
    urlParams: {ipSetId},
    headers: {Authorization: `Bearer ${authToken}`},
  };
  const response = await new VcloudWrapper().posts('user.ipSets.deleteIpSets', options);
  return Promise.resolve({
    __vcloudTask: response.headers['location'],
  });
}

module.exports = userDeleteIPSet;
