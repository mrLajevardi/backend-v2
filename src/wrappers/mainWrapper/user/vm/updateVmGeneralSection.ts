const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const userGetVApp = require('./getVapp');
/**
 * general section in panel
 * @param {String} authToken
 * @param {String} vmId
 * @param {String} name
 * @param {String} computerName
 * @param {String} description
 * @param {String} osType
 * @param {Number} bootDelay
 * @param {Boolean} enterBIOSSetup
 * @return {Promise<Object>}
 */
async function userUpdateVmGeneralSection(
    authToken,
    vmId,
    name,
    computerName,
    description,
    osType,
    bootDelay,
    enterBIOSSetup,
) {
  const vmInfo = await userGetVApp(authToken, vmId);
  const vmInfoData = vmInfo.data;
  // change name
  vmInfoData.name = name;
  // change description
  vmInfoData.description = description;
  vmInfoData.section.forEach((section) => {
    if (section._type === 'OperatingSystemSectionType') {
      // change os type
      section.otherAttributes['{http://www.vmware.com/schema/ovf}osType'] = osType;
    }
    if (section._type === 'GuestCustomizationSectionType') {
      // change computer name
      section.computerName = computerName;
    }
  });
  if (vmInfoData.bootOptions) {
    vmInfoData.bootOptions.enterBIOSSetup = enterBIOSSetup;
    vmInfoData.bootOptions.bootDelay = bootDelay;
  }
  const generalSection = await new VcloudWrapper().posts('user.vm.updateVm', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId},
    body: vmInfoData,
  });
  return Promise.resolve({
    __vcloudTask: generalSection.headers['location'],
  });
};

module.exports = userUpdateVmGeneralSection;
