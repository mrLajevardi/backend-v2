const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} vmId
 * @param {Object} config
 * @return {Promise}
 */
async function userUpdateGuestCustomization(authToken, vmId, config) {
  const requestBody = {
    _type: 'GuestCustomizationSectionType',
    enabled: config.enabled,
    changeSid: config.changeSid,
    joinDomainEnabled: config.joinDomainEnabled,
    useOrgSettings: config.useOrgSettings,
    domainName: config.domainName,
    domainUserName: config.domainUserName,
    domainUserPassword: config.domainUserPassword,
    machineObjectOU: config.machineObjectOU,
    adminPasswordEnabled: config.adminPasswordEnabled,
    adminPasswordAuto: config.adminPasswordAuto,
    adminPassword: config.adminPassword,
    adminAutoLogonEnabled: config.adminAutoLogonEnabled,
    adminAutoLogonCount: config.adminAutoLogonCount,
    resetPasswordRequired: config.resetPasswordRequired,
    customizationScript: config.customizationScript,
    computerName: config.computerName,
  };
  const guestCustomizationSection = await new VcloudWrapper()
      .posts('user.vm.updateGuestCustomization', {
        headers: {Authorization: `Bearer ${authToken}`},
        urlParams: {vmId},
        body: requestBody,
      });
  return Promise.resolve({
    __vcloudTask: guestCustomizationSection.headers['location'],
  });
};

module.exports = userUpdateGuestCustomization;
