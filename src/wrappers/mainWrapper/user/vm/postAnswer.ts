const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
export const userPostAnswer = async (authToken, vmId, questionId, choiceId) => {
  const answer = await new VcloudWrapper().posts('user.vm.answer', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId},
    body: {
      questionId,
      choiceId,
    },
  });
  return Promise.resolve({
    __vcloudTask: answer.headers['location'],
  });
};

module.exports = userPostAnswer;
