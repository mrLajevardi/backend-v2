import { createVdcEndpoint } from './createVdcEndpoint';
import { deleteVdcEndpoint } from './deleteVdcEndpoint';
import { disableVdcEndpoint } from './disableVdcEndpoint';
import { enableVdcEndpoint } from './enableVdcEndpoint';
import { updateNetworkProfileEndpoint } from './updateNetworkProfileEndpoint';
import { updateVdcEndpoint } from './updateVdcEndpoint';
import { updateVdcStorageProfileEndpoint } from './updateVdcStorageProfileEndpoint';

export const adminVdcEndpoints = {
  createVdc: createVdcEndpoint,
  updateVdc: updateVdcEndpoint,
  updateVdcStorageProfile: updateVdcStorageProfileEndpoint,
  deleteVdc: deleteVdcEndpoint,
  disableVdc: disableVdcEndpoint,
  enableVdc: enableVdcEndpoint,
  updateNetworkProfile: updateNetworkProfileEndpoint,
};

