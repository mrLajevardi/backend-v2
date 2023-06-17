const cancelTask = require('./cancelTask');
const userGetTask = require('./getTask');

const tasksWrapper = {
  getTask: userGetTask,
  cancelTask: cancelTask,
};

module.exports = tasksWrapper;
