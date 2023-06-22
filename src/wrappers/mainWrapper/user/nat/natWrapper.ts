import { userCreateNatRule } from './createNatRule';
import { userDeleteNatRule } from './deleteNatRule';
import { userGetNatRule } from './getNatRule';
import { userGetNatRuleList } from './getNatRules';
import { userUpdateNatRule } from './updateNatRule';

export const natWrapper = {
  createNatRule: userCreateNatRule,
  deleteNatRule: userDeleteNatRule,
  getNatRule: userGetNatRule,
  getNatRuleList: userGetNatRuleList,
  updateNatRule: userUpdateNatRule,
};

module.exports = natWrapper;
