import { createProviderSessionEndpoint } from './createProviderSessionEndpoint';
import { createUserEndpoint } from './createUserEndpoint';
import { createUserSessionEndpoint } from './createUserSessionEndpoint';

export const userEndpoints = {
  createProviderSession: createProviderSessionEndpoint,
  createUserSession: createUserSessionEndpoint,
  createUser: createUserEndpoint,
};
