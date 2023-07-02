import { userCreateDhcpBinding } from './createDhcpBinding';
import { userDeleteDhcp } from './deleteDhcp';
import { userDeleteDhcpBinding } from './deleteDhcpBindings';
import { userGetAllDhcpBindings } from './getAllDhcpBindings';
import { userGetDhcp } from './getDhcp';
import { userGetDhcpBinding } from './getDhcpBinding';
import { userUpdateDhcp } from './updateDhcp';
import { userUpdateDhcpBinding } from './updateDhcpBinding';

export const dhcpWrapper = {
  updateDhcp: userUpdateDhcp,
  getDhcp: userGetDhcp,
  deleteDhcp: userDeleteDhcp,
  createDhcpBinding: userCreateDhcpBinding,
  updateDhcpBinding: userUpdateDhcpBinding,
  deleteDhcpBinding: userDeleteDhcpBinding,
  getAllDhcpBindings: userGetAllDhcpBindings,
  getDhcpBinding: userGetDhcpBinding,
};

