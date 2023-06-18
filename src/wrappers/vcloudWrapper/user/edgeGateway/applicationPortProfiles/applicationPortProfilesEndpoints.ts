const createApplicationPortProfilesEndpoint = require('./createApplicationPortProfileEndpoint');
const deleteApplicationPortProfilesEndpoint = require('./deleteApplicationPortProfileEndpoint');
const getApplicationPortProfileEndpoint = require('./getApplicationPortProfileEndpoint');
const getApplicationPortProfilesListEndpoint = require('./getApplicationPortProfilesListEndpoint');
const updateApplicationPortProfilesEndpoint = require('./updateApplicationPortProfileEndpoint');

export const applicationPortProfilesEndpoints = {
  createApplicationPortProfile: createApplicationPortProfilesEndpoint,
  deleteApplicationPortProfile: deleteApplicationPortProfilesEndpoint,
  updateApplicationPortProfile: updateApplicationPortProfilesEndpoint,
  getApplicationPortProfilesList: getApplicationPortProfilesListEndpoint,
  getApplicationPortProfile: getApplicationPortProfileEndpoint,
};

module.exports = applicationPortProfilesEndpoints;
