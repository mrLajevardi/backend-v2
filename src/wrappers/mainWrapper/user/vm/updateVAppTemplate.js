const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
async function userUpdateVAppTemplate(authToken, templateId, name, description) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {templateId},
    body: {
      name,
      description,
    },
  };
  const action = await new VcloudWrapper().posts('user.vm.updateVAppTemplate', options);
  return Promise.resolve({
    __vcloudTask: action.headers['location'],
  });
};

module.exports = userUpdateVAppTemplate;
