import { cancelTask } from './cancelTask';
import { userGetTask } from './getTask';

export const tasksWrapper = {
  getTask: userGetTask,
  cancelTask: cancelTask,
};

module.exports = tasksWrapper;
