const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
export const cancelTask = async (authToken, taskId) => {
  await new VcloudWrapper().posts('user.tasks.cancelTask', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {taskId},
  });
  return;
};

module.exports = cancelTask;
