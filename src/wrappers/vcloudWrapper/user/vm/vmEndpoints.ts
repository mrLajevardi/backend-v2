const updateNetworkSectionEndpoint = require('./updateNetworkSectionEndpoint');
const acquireVmTicketEndpoint = require('./acquireVmTicketEndpoint');
const createTemplateEndpoint = require('./createTemplateEndpoint');
const createVmEndpoint = require('./createVmEndpoint');
const deleteVmEndpoint = require('./deleteVmEndpoint');
const deployVmEndpoint = require('./deployVmEndpoint');
const discardSuspendVmEndpoint = require('./discardSuspendVmEndpoint');
const getVmEndpoint = require('./getVmEndpoint');
const getVmTemplatesEndpoint = require('./getVmTemplatesEndpoint');
const insertOrEjectEndpoint = require('./insertOrEjectMediaEndpoint');
const installVmToolsEndpoint = require('./installVmToolsEndpoint');
const instantiateVmFromTemplateEndpoint = require('./instantiateVmFromTemplateEndpoint');
const powerOnVmEndpoint = require('./powerOnVmEndpoint');
const resetVmEndpoint = require('./resetVmEndpoint');
const suspendVmEndpoint = require('./suspendVmEndpoint');
const undeployVmEndpoint = require('./undeployVmEndpoint');
const updateVmEndpoint = require('./updateVmEndpoint');
const createVmSnapShot = require('./createVmSnapShot');
const removeVmSnapShot = require('./removeVmSnapShot');
const revertVmSnapShot = require('./revertVmSnapShot');
const updateGuestCustomizationEndpoint = require('./updateGuestCustomizationEndpoint');
const questionEndpoint = require('./questionEndpoint');
const answerEndpoint = require('./answerEndpoint');
const rebootVmEndpoint = require('./rebootVmEndpoint');
const uploadFileEndpoint = require('./uploadFileEndpoint');
const partialUploadEndpoint = require('./partialUploadEndpoint');
const getMediaItemEndpoint = require('./getMediaItemEndpoint');
const deleteMediaEndpoint = require('./deleteMediaEndpoint');
const deleteTemplateEndpoint = require('./deleteTemplateEndpoint');
const updateVAppTemplateEndpoint = require('./updateVAppTemplateEndpoint');
const updateMediaEndpoint = require('./updateMediaEndpoint');

const vmEndpoints = {
  createVm: createVmEndpoint,
  deleteVm: deleteVmEndpoint,
  acquireVmTicket: acquireVmTicketEndpoint,
  updateVm: updateVmEndpoint,
  getVmTemplates: getVmTemplatesEndpoint,
  getVm: getVmEndpoint,
  powerOnVm: powerOnVmEndpoint,
  undeployVm: undeployVmEndpoint,
  deployVm: deployVmEndpoint,
  discardSuspendVm: discardSuspendVmEndpoint,
  resetVm: resetVmEndpoint,
  suspendVm: suspendVmEndpoint,
  instantiateVmFromTemplate: instantiateVmFromTemplateEndpoint,
  insertOrEjectVm: insertOrEjectEndpoint,
  installVmTools: installVmToolsEndpoint,
  createTemplate: createTemplateEndpoint,
  createSnapShot: createVmSnapShot,
  removeSnapShot: removeVmSnapShot,
  revertSnapShot: revertVmSnapShot,
  updateNetworkSection: updateNetworkSectionEndpoint,
  updateGuestCustomization: updateGuestCustomizationEndpoint,
  getQuestion: questionEndpoint,
  answer: answerEndpoint,
  rebootVm: rebootVmEndpoint,
  uploadFile: uploadFileEndpoint,
  partialUpload: partialUploadEndpoint,
  getMediaItem: getMediaItemEndpoint,
  deleteMedia: deleteMediaEndpoint,
  deleteTemplate: deleteTemplateEndpoint,
  updateVAppTemplate: updateVAppTemplateEndpoint,
  updateMedia: updateMediaEndpoint,
};

module.exports = vmEndpoints;
