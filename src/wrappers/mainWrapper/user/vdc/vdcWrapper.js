const userGetHardwareInfo = require('./getHardwareInfo');
const userGetVdcComputePolicy = require('./getVdcComputePolicy');
const userVcloudQuery = require('./vcloudQuery');
const userCreateNamedDisk = require('./createNamedDisk');
const userGetNamedDisk = require('./getNamedDisk');
const userRemoveNamedDisk = require('./removeNamedDisk');
const userUpdateNamedDisk = require('./updateNamedDisk');
const userAttachNamedDisk = require('./attachNamedDisk');
const userDettachNamedDisk = require('./dettachNamedDisk');
const userGetVmAttachedNamedDisk = require('./getVmAttachedNamedDisk');

const vdcWrapper = {
  vcloudQuery: userVcloudQuery,
  getVdcComputePolicy: userGetVdcComputePolicy,
  getHardwareInfo: userGetHardwareInfo,
  createNamedDisk: userCreateNamedDisk,
  getNamedDisk: userGetNamedDisk,
  removeNamedDisk: userRemoveNamedDisk,
  updateNamedDisk: userUpdateNamedDisk,
  attachNamedDisk: userAttachNamedDisk,
  dettachNamedDisk: userDettachNamedDisk,
  getVmAttachedNamedDisk: userGetVmAttachedNamedDisk,
};

module.exports = vdcWrapper;
