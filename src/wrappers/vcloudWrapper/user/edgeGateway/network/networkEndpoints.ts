const createNetworkEndpoint = require('./createNetworkEndpoint');
const deleteNetworkEndpoint = require('./deleteNetworkEndpoint');
const getNetworkEndpoint = require('./getNetworkEndpoint');
const getNetworkListEndpoint = require('./getNetworkListEndpoint');
const updateNetworkEndpoint = require('./updateNetworkEndpoint');
const getNetworkIPUsageListEndpoint = require('./getNetworkIPUsageListEndpoint');

export const networkEndpoints = {
  deleteNetwork: deleteNetworkEndpoint,
  createNetwork: createNetworkEndpoint,
  updateNetwork: updateNetworkEndpoint,
  getNetworkList: getNetworkListEndpoint,
  getNetwork: getNetworkEndpoint,
  getNetworkIPUsageList: getNetworkIPUsageListEndpoint,
};

module.exports = networkEndpoints;
