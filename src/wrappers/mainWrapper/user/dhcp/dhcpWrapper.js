const userCreateDhcpBinding = require('./createDhcpBinding');
const userDeleteDhcp = require('./deleteDhcp');
const userDeleteDhcpBinding = require('./deleteDhcpBindings');
const userGetAllDhcpBindings = require('./getAllDhcpBindings');
const userGetDhcp = require('./getDhcp');
const userGetDhcpBinding = require('./getDhcpBinding');
const userUpdateDhcp = require('./updateDhcp');
const userUpdateDhcpBinding = require('./updateDhcpBinding');

const dhcpWrapper = {
  updateDhcp: userUpdateDhcp,
  getDhcp: userGetDhcp,
  deleteDhcp: userDeleteDhcp,
  createDhcpBinding: userCreateDhcpBinding,
  updateDhcpBinding: userUpdateDhcpBinding,
  deleteDhcpBinding: userDeleteDhcpBinding,
  getAllDhcpBindings: userGetAllDhcpBindings,
  getDhcpBinding: userGetDhcpBinding,
};

module.exports = dhcpWrapper;
