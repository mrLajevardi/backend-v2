const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} networkId
 * @return {Promise}
 */
export async function userDeleteNetwork(authToken, networkId) {
  const options = {
    params: {
      force: true,
    },
    urlParams: {networkId},
    headers: {Authorization: `Bearer ${authToken}`},
  };
  const deletedNetwork = await new VcloudWrapper().posts('user.network.deleteNetwork', options);
  return Promise.resolve({
    __vcloudTask: deletedNetwork.headers['location'],
  });
};

module.exports = userDeleteNetwork;
