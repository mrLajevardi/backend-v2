import { createIpSetsEndpoint } from './createIpSetsEndpoint';
import { deleteIpSetsEndpoint } from './deleteIpSetsEndpoint';
import { getIpSetsEndpoint } from './getIpSetsEndpoint';
import { getIpSetsListEndpoint } from './getIpSetsListEndpoint';
import { updateIpSetsEndpoint } from './updateIpSetsEndpoint';

export const ipSetsEndpoints = {
  createIpSets: createIpSetsEndpoint,
  updateIpSets: updateIpSetsEndpoint,
  getIpSetsList: getIpSetsListEndpoint,
  getIpSets: getIpSetsEndpoint,
  deleteIpSets: deleteIpSetsEndpoint,
};
