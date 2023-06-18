const createProviderSessionEndpoint = require('./createProviderSessionEndpoint');
const createUserEndpoint = require('./createUserEndpoint');
const createUserSessionEndpoint = require('./createUserSessionEndpoint');

export const userEndpoints = {
  createProviderSession: createProviderSessionEndpoint,
  createUserSession: createUserSessionEndpoint,
  createUser: createUserEndpoint,
};

module.exports = userEndpoints;
