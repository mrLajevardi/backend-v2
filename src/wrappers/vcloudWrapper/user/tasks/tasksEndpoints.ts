import { cancelTaskEndpoint } from './cancelTaskEndpoint';
import { getTaskEndpoint } from './getTaskEndpoint';
import { getTaskListEndpoint } from './getTaskListEndPoint';
export const tasksEndpoints = {
  getTask: getTaskEndpoint,
  getTaskList: getTaskListEndpoint,
  cancelTask: cancelTaskEndpoint,
};

module.exports = tasksEndpoints;
