import { createNetworkEndpoint } from './createNetworkEndpoint';
import { deleteNetworkEndpoint } from './deleteNetworkEndpoint';
import { getNetworkEndpoint } from './getNetworkEndpoint';
import { getNetworkListEndpoint } from './getNetworkListEndpoint';
import { updateNetworkEndpoint } from './updateNetworkEndpoint';
import { getNetworkIPUsageListEndpoint } from './getNetworkIPUsageListEndpoint';

export const networkEndpoints = {
  deleteNetwork: deleteNetworkEndpoint,
  createNetwork: createNetworkEndpoint,
  updateNetwork: updateNetworkEndpoint,
  getNetworkList: getNetworkListEndpoint,
  getNetwork: getNetworkEndpoint,
  getNetworkIPUsageList: getNetworkIPUsageListEndpoint,
};
