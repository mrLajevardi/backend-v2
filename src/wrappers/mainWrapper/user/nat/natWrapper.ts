const userCreateNatRule = require('./createNatRule');
const userDeleteNatRule = require('./deleteNatRule');
const userGetNatRule = require('./getNatRule');
const userGetNatRuleList = require('./getNatRules');
const userUpdateNatRule = require('./updateNatRule');

export const natWrapper = {
  createNatRule: userCreateNatRule,
  deleteNatRule: userDeleteNatRule,
  getNatRule: userGetNatRule,
  getNatRuleList: userGetNatRuleList,
  updateNatRule: userUpdateNatRule,
};

module.exports = natWrapper;
