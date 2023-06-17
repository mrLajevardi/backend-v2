const getHardwareInfoEndpoint = require('./getHardwareInfoEndpoint');
const getVdcComputePolicyEndpoint = require('./getVdcComputePolicyEndpoint');
const vcloudQueryEndpoint = require('./vcloudQueryEndpoint');
const createNamedDisk = require('./createNamedDisk');
const removeNamedDisk = require('./removeNamedDisk');
const updateNamedDisk = require('./updateNamedDisk');
const attachNamedDisk = require('./attachNamedDisk');
const dettachNamedDisk = require('./dettachNamedDisk');
const vmAttachedNamedDisk = require('./getVmAttachedNamedDisk');

const vdcEndpoints = {
  getHardwareInfo: getHardwareInfoEndpoint,
  getVdcComputePolicy: getVdcComputePolicyEndpoint,
  vcloudQuery: vcloudQueryEndpoint,
  createNamedDisk: createNamedDisk,
  removeNamedDisk: removeNamedDisk,
  updateNamedDisk: updateNamedDisk,
  attachNamedDisk: attachNamedDisk,
  dettachNamedDisk: dettachNamedDisk,
  vmAttachedNamedDisk: vmAttachedNamedDisk,
};

module.exports = vdcEndpoints;
