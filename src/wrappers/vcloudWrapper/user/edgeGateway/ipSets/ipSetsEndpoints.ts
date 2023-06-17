const createIpSetsEndpoint = require('./createIpSetsEndpoint');
const deleteIpSetsEndpoint = require('./deleteIpSetsEndpoint');
const getIpSetsEndpoint = require('./getIpSetsEndpoint');
const getIpSetsListEndpoint = require('./getIpSetsListEndpoint');
const updateIpSetsEndpoint = require('./updateIpSetsEndpoint');

const ipSetsEndpoints = {
  createIpSets: createIpSetsEndpoint,
  updateIpSets: updateIpSetsEndpoint,
  getIpSetsList: getIpSetsListEndpoint,
  getIpSets: getIpSetsEndpoint,
  deleteIpSets: deleteIpSetsEndpoint,
};

module.exports = ipSetsEndpoints;

