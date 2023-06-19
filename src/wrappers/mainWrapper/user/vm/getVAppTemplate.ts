const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
export const userGetVAppTemplate = (authToken, templateId) => {
  const vmTemplate = new VcloudWrapper().posts('user.vm.getVmTemplates', {
    urlParams: {
      vmId: templateId,
    },
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return vmTemplate;
};

module.exports = userGetVAppTemplate;
