const userAcquireVappTicket = require('./acquireVappTicket');
const userCreateTemplate = require('./createTemplate');
const userCreateVm = require('./createVm');
const userDeletevApp = require('./deleteVm');
const userDeployvApp = require('./deployVapp');
const userDiscardSuspendedStatevApp = require('./discardSuspendedStateVapp');
const userGetVApp = require('./getVapp');
const userGetVAppTemplate = require('./getVAppTemplate');
const userInsertOrEjectVappMedia = require('./insertOrEjectVappMedia');
const userInstallVmTools = require('./installVmTools');
const userInstantiateVmFromTemplate = require('./instantiateVmFromTemplate');
const userPowerOnvApp = require('./powerOnVapp');
const userResetvApp = require('./resetVapp');
const userSuspendVapp = require('./suspendVapp');
const userUpdateVm = require('./updateVm');
const userCreateSnapShot = require('./createSnapShot');
const userRemoveSnapShot = require('./removeSnapShot');
const userRevertSnapShot = require('./revertSnapShot');
const userUpdateNetworkSection = require('./updateNetworkSection');
const userUpdateGuestCustomization = require('./updateGuestCustomization');
const userUpdateVmComputeSection = require('./updateVmComputeSection');
const userUpdateVmGeneralSection = require('./updateVmGeneralSection');
const userUpdateDiskSection = require('./updateDiskSection');
const userGetQuestion = require('./getQuestion');
const userPostAnswer = require('./postAnswer');
const userRebootVm = require('./rebootVm');
const userUndeployvApp = require('./undeployVapp');
const instantiateVmFromTemplateAdmin = require('./instantiateVmFromTemplateAdmin');
const uploadFile = require('./uploadFile');
const userGetMediaItem = require('./getMediaItem');
const userDeleteMedia = require('./deleteMedia');
const userDeleteTemplate = require('./deleteTemplate');
const userUpdateVAppTemplate = require('./updateVAppTemplate');
const userUpdateMedia = require('./updateMedia');

const vmWrapper = {
  acquireVappTicket: userAcquireVappTicket,
  createVm: userCreateVm,
  deleteVm: userDeletevApp,
  deployVm: userDeployvApp,
  discardSuspendVm: userDiscardSuspendedStatevApp,
  getVapp: userGetVApp,
  getVappTemplate: userGetVAppTemplate,
  insertOrEjectVappMedia: userInsertOrEjectVappMedia,
  instantiateVmFromTemplate: userInstantiateVmFromTemplate,
  powerOnVm: userPowerOnvApp,
  resetVm: userResetvApp,
  suspendVm: userSuspendVapp,
  undeployVm: userUndeployvApp,
  updateVm: userUpdateVm,
  installVmTools: userInstallVmTools,
  createTemplate: userCreateTemplate,
  createSnapShot: userCreateSnapShot,
  removeSnapShot: userRemoveSnapShot,
  revertSnapShot: userRevertSnapShot,
  updateNetworkSection: userUpdateNetworkSection,
  updateGuestCustomization: userUpdateGuestCustomization,
  updateVmComputeSection: userUpdateVmComputeSection,
  updateVmGeneralSection: userUpdateVmGeneralSection,
  updateVmDiskSection: userUpdateDiskSection,
  getQuestion: userGetQuestion,
  postAnswer: userPostAnswer,
  rebootVm: userRebootVm,
  instantiateVmFromTemplateAdmin: instantiateVmFromTemplateAdmin,
  uploadFile: uploadFile,
  getMediaItem: userGetMediaItem,
  deleteMedia: userDeleteMedia,
  deleteTemplate: userDeleteTemplate,
  updateVAppTemplate: userUpdateVAppTemplate,
  updateMedia: userUpdateMedia,
};

module.exports = vmWrapper;
