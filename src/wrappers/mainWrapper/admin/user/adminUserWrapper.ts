import { createSessionWrapper } from './createSession';
import { createUser } from './createUser';


export const adminUserWrapper = {
  createSession: {
    providerSession: createSessionWrapper.providerSession,
    userSession: createSessionWrapper.userSession,
  },
  createUser: createUser,
};

