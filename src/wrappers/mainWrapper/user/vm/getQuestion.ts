const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
export const userGetQuestion = async (authToken, vmId) => {
  const question = await new VcloudWrapper().posts('user.vm.getQuestion', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId},
  });
  return question.data;
};

module.exports = userGetQuestion;
