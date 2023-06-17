const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const userGetTask = (authToken, taskId) => {
  const task = new VcloudWrapper().posts('user.tasks.getTask', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {taskId},
  });
  return task;
};

module.exports = userGetTask;
