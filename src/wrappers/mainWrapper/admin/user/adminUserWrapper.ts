const createSession = require('./createSession');
const createUser = require('./createUser');

export const adminUserWrapper = {
  createSession: createSession,
  createUser: createUser,
};

module.exports = adminUserWrapper;
