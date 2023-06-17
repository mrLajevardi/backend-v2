const createVdc = require('./createVdc');
const updateVdc = require('./updateVdc');
const updateVdcStorageProfile = require('./updateVdcStorageProfile');
const deleteVdc = require('./deleteVdc');
const enableVdc = require('./enableVdc');
const disableVdc = require('./disableVdc');
const updateNetworkProfile = require('./updateNetworkProfile');

export const adminVdcWrapper = {
  createVdc: createVdc,
  updateVdc: updateVdc,
  updateVdcStorageProfile: updateVdcStorageProfile,
  deleteVdc: deleteVdc,
  disableVdc: disableVdc,
  enableVdc: enableVdc,
  updateNetworkProfile: updateNetworkProfile,
};

module.exports = adminVdcWrapper;
