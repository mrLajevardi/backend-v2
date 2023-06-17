const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
const {isEmpty} = require('../../../../utils/helpers');
const HttpExceptions = require('../../../../exceptions/httpExceptions');

/**
 * get dns forwarder lists
 * @param {String} authToken
 * @param {String} edgeName
 * @return {Promise}
 */

async function getDnsForwarder(authToken, edgeName) {
  const gateway = await getEdgeGateway(authToken);

  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
      .id;

  const dns = await new VcloudWrapper().posts(
      'user.edgeGateway.getDnsForwarder',
      {
        headers: {Authorization: `Bearer ${authToken}`},
        urlParams: {gatewayId},
      },
  );
  console.log(
      '🚀 ~ file: getDnsForwarder.js ~ line 29 ~ getDnsForwarder ~ Promise.resolve(dns)',
      Promise.resolve(dns.data),
  );
  return Promise.resolve(dns.data);
}
module.exports = getDnsForwarder;
