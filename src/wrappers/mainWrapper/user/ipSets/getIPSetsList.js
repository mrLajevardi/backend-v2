const HttpExceptions = require('../../../../exceptions/httpExceptions');
const {isEmpty} = require('../../../../utils/helpers');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @param {String} edgeName
 * @param {String} filter
 * @return {Promise}
 */
async function userGetIPSetsList(authToken, page, pageSize, edgeName, filter = '') {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const response = await new VcloudWrapper().posts('user.ipSets.getIpSetsList', {
    params: {
      page,
      pageSize,
      filter: `((ownerRef.id==${gatewayId};typeValue==IP_SET))` + filter,
      sortAsc: 'name',
    },
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return Promise.resolve(response.data);
}
module.exports = userGetIPSetsList;
