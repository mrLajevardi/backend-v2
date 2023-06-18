const cancelTask = require('./cancelTask');
const userGetTask = require('./getTask');

export const tasksWrapper = {
  getTask: userGetTask,
  cancelTask: cancelTask,
};

module.exports = tasksWrapper;
