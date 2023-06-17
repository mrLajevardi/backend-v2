const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * delete media by given id
 * @param {String} authToken
 * @param {String} mediaId
 */
async function userDeleteTemplate(authToken, templateId) {
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {templateId},
  };
  const deletedTemplate = await new VcloudWrapper().posts('user.vm.deleteTemplate', options);
  return Promise.resolve({
    __vcloudTask: deletedTemplate.headers['location'],
  });
};
module.exports = userDeleteTemplate;
