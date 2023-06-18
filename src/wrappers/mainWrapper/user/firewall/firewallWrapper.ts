const userDeleteFirewall = require('./deleteFirewall');
const userGetFirewallList = require('./getFirewallList');
const userGetSingleFirewall = require('./getSingleFirewall');
const userUpdateFirewallList = require('./updateFirewallList');
const userUpdateSingleFirewall = require('./updateSingleFirewall');

export const firewallWrapper = {
  getFirewallList: userGetFirewallList,
  getSingleFirewall: userGetSingleFirewall,
  updateFirewallList: userUpdateFirewallList,
  updateSingleFirewall: userUpdateSingleFirewall,
  deleteFirewall: userDeleteFirewall,
};

module.exports = firewallWrapper;
