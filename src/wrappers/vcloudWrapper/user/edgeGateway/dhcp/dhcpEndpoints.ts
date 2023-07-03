import { createDhcpBindingEndpoint } from './createDhcpBindingEndpoint';
import { deleteDhcpBindingsEndpoint } from './deleteDhcpBindingEndpoint';
import { deleteDhcpEndpoint } from './deleteDhcpEndpoint';
import { getAllDhcpBindingEndpoint } from './getAllDhcpBindingsEndpoint';
import { getDhcpBindingEndpoint } from './getDhcpBinidngEndpoint';
import { getDhcpEndpoint } from './getDhcpEndpoint';
import { updateDhcpBindingEndpoint } from './updateDhcpBindingEndpoing';
import { updateDhcpEndpoint } from './updateDhcpEndpoint';

export const dhcpEndpoints = {
  updateDhcp: updateDhcpEndpoint,
  getDhcp: getDhcpEndpoint,
  deleteDhcp: deleteDhcpEndpoint,
  createDhcpBinding: createDhcpBindingEndpoint,
  updateDhcpBinding: updateDhcpBindingEndpoint,
  deleteDhcpBinding: deleteDhcpBindingsEndpoint,
  getAllDhcpBindings: getAllDhcpBindingEndpoint,
  getDhcpBinding: getDhcpBindingEndpoint,
};
