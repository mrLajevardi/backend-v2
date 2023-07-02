import { userDeleteFirewall } from './deleteFirewall';
import { userGetFirewallList } from './getFirewallList';
import { userGetSingleFirewall } from './getSingleFirewall';
import { userUpdateFirewallList } from './updateFirewallList';
import { userUpdateSingleFirewall } from './updateSingleFirewall';

export const firewallWrapper = {
  getFirewallList: userGetFirewallList,
  getSingleFirewall: userGetSingleFirewall,
  updateFirewallList: userUpdateFirewallList,
  updateSingleFirewall: userUpdateSingleFirewall,
  deleteFirewall: userDeleteFirewall,
};

