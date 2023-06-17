const createNatEndpoint = require('./createNatEndpoint');
const deleteNatEndpoint = require('./deleteNatLEndpoint');
const getNatEndpoint = require('./getNatEndpoint');
const getNatListEndpoint = require('./getNatListEndpoint');
const updateNatEndpoint = require('./updateNatEndpoint');

const natEndpoints = {
  getNatList: getNatListEndpoint,
  deleteNat: deleteNatEndpoint,
  getNat: getNatEndpoint,
  updateNat: updateNatEndpoint,
  createNat: createNatEndpoint,
};

module.exports = natEndpoints;

