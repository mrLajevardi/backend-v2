import { createSessionWrapper } from './createSession';
import { createUser } from './createUser';

const sessionWrapper = new createSessionWrapper();

export const adminUserWrapper = {
  createSession: sessionWrapper.createSession,
  createUser: createUser,
};

module.exports = adminUserWrapper;
