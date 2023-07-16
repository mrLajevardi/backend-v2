import { updateNetworkSectionEndpoint } from './updateNetworkSectionEndpoint';
import { acquireVmTicketEndpoint } from './acquireVmTicketEndpoint';
import { createTemplateEndpoint } from './createTemplateEndpoint';
import { createVmEndpoint } from './createVmEndpoint';
import { deleteVmEndpoint } from './deleteVmEndpoint';
import { deployVmEndpoint } from './deployVmEndpoint';
import { discardSuspendVmEndpoint } from './discardSuspendVmEndpoint';
import { getVmEndpoint } from './getVmEndpoint';
import { getVmTemplatesEndpoint } from './getVmTemplatesEndpoint';
import { insertOrEjectEndpoint } from './insertOrEjectMediaEndpoint';
import { installVmToolsEndpoint } from './installVmToolsEndpoint';
import { instantiateVmFromTemplateEndpoint } from './instantiateVmFromTemplateEndpoint';
import { powerOnVmEndpoint } from './powerOnVmEndpoint';
import { resetVmEndpoint } from './resetVmEndpoint';
import { suspendVmEndpoint } from './suspendVmEndpoint';
import { undeployVmEndpoint } from './undeployVmEndpoint';
import { updateVmEndpoint } from './updateVmEndpoint';
import { createVmSnapShot } from './createVmSnapShot';
import { removeVmSnapShot } from './removeVmSnapShot';
import { revertVmSnapShot } from './revertVmSnapShot';
import { updateGuestCustomizationEndpoint } from './updateGuestCustomizationEndpoint';
import { questionEndpoint } from './questionEndpoint';
import { answerEndpoint } from './answerEndpoint';
import { rebootVmEndpoint } from './rebootVmEndpoint';
import { uploadFileEndpoint } from './uploadFileEndpoint';
import { partialUploadEndpoint } from './partialUploadEndpoint';
import { getMediaItemEndpoint } from './getMediaItemEndpoint';
import { deleteMediaEndpoint } from './deleteMediaEndpoint';
import { deleteTemplateEndpoint } from './deleteTemplateEndpoint';
import { updateVAppTemplateEndpoint } from './updateVAppTemplateEndpoint';
import { updateMediaEndpoint } from './updateMediaEndpoint';

export const vmEndpoints = {
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
