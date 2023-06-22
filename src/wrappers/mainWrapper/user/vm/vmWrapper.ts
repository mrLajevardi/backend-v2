import { userAcquireVappTicket } from './acquireVappTicket';
import { createTemplate } from './createTemplate';
import { userCreateVm } from './createVm';
import { userDeletevApp } from './deleteVm';
import { userDeployvApp } from './deployVapp';
import { userDiscardSuspendedStatevApp } from './discardSuspendedStateVapp';
import { userGetVApp } from './getVapp';
import { userGetVAppTemplate } from './getVAppTemplate';
import { userInsertOrEjectVappMedia } from './insertOrEjectVappMedia';
import { userInstallVmTools } from './installVmTools';
import { userInstantiateVmFromTemplate } from './instantiateVmFromTemplate';
import { userPowerOnvApp } from './powerOnVapp';
import { userResetvApp } from './resetVapp';
import { userSuspendVapp } from './suspendVapp';
import { userUpdateVm } from './updateVm';
import { userCreateSnapShot } from './createSnapShot';
import { userRemoveSnapShot } from './removeSnapShot';
import { userRevertSnapShot } from './revertSnapShot';
import { userUpdateNetworkSection } from './updateNetworkSection';
import { userUpdateGuestCustomization } from './updateGuestCustomization';
import { userUpdateVmComputeSection } from './updateVmComputeSection';
import { userUpdateVmGeneralSection } from './updateVmGeneralSection';
import { userUpdateDiskSection } from './updateDiskSection';
import { userGetQuestion } from './getQuestion';
import { userPostAnswer } from './postAnswer';
import { userRebootVm } from './rebootVm';
import { userUndeployvApp } from './undeployVapp';
import { instantiateVmFromTemplateAdmin } from './instantiateVmFromTemplateAdmin';
import { uploadFile } from './uploadFile';
import { userGetMediaItem } from './getMediaItem';
import { userDeleteMedia } from './deleteMedia';
import { userDeleteTemplate } from './deleteTemplate';
import { userUpdateVAppTemplate } from './updateVAppTemplate';
import { userUpdateMedia } from './updateMedia';

export const vmWrapper = {
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
  createTemplate: createTemplate,
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
