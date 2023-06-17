const createVdcEndpoint = require('./createVdcEndpoint');
const updateVdcEndpoint = require('./updateVdcEndpoint');
const deleteVdcEndpoint = require('./deleteVdcEndpoint');
const enableVdcEndpoint = require('./enableVdcEndpoint');
const updateVdcStorageProfileEndpoint = require('./updateVdcStorageProfileEndpoint');
const disableVdcEndpoint = require('./disableVdcEndpoint');
const updateNetworkProfileEndpoint = require('./updateNetworkProfileEndpoint');

const adminVdcEndpoints = {
  createVdc: createVdcEndpoint,
  updateVdc: updateVdcEndpoint,
  updateVdcStorageProfile: updateVdcStorageProfileEndpoint,
  deleteVdc: deleteVdcEndpoint,
  disableVdc: disableVdcEndpoint,
  enableVdc: enableVdcEndpoint,
  updateNetworkProfile: updateNetworkProfileEndpoint,
};

module.exports = adminVdcEndpoints;
