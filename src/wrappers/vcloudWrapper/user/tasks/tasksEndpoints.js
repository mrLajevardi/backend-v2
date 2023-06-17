const cancelTaskEndpoint = require('./cancelTaskEndpoint');
const getTaskEndpoint = require('./getTaskEndpoint');
const getTaskListEndpoint = require('./getTaskListEndPoint');
const tasksEndpoints = {
  getTask: getTaskEndpoint,
  getTaskList: getTaskListEndpoint,
  cancelTask: cancelTaskEndpoint,
};


module.exports = tasksEndpoints;
