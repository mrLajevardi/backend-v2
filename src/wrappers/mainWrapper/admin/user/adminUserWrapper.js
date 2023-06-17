const createSession = require('./createSession');
const createUser = require('./createUser');

const adminUserWrapper = {
  createSession: createSession,
  createUser: createUser,
};

module.exports = adminUserWrapper;
