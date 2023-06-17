const createDhcpBindingEndpoint = require('./createDhcpBindingEndpoint');
const deleteDhcpBindingsEndpoint = require('./deleteDhcpBindingEndpoint');
const deleteDhcpEndpoint = require('./deleteDhcpEndpoint');
const getAllDhcpBindingEndpoint = require('./getAllDhcpBindingsEndpoint');
const getDhcpBindingEndpoint = require('./getDhcpBinidngEndpoint');
const getDhcpEndpoint = require('./getDhcpEndpoint');
const updateDhcpBindingEndpoint = require('./updateDhcpBindingEndpoing');
const updateDhcpEndpoint = require('./updateDhcpEndpoint');

const dhcpEndpoints = {
  updateDhcp: updateDhcpEndpoint,
  getDhcp: getDhcpEndpoint,
  deleteDhcp: deleteDhcpEndpoint,
  createDhcpBinding: createDhcpBindingEndpoint,
  updateDhcpBinding: updateDhcpBindingEndpoint,
  deleteDhcpBinding: deleteDhcpBindingsEndpoint,
  getAllDhcpBindings: getAllDhcpBindingEndpoint,
  getDhcpBinding: getDhcpBindingEndpoint,
};

module.exports = dhcpEndpoints;
