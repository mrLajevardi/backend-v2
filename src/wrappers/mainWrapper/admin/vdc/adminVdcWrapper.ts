import { createVdc } from './createVdc';
import { updateVdc } from './updateVdc';
import { updateVdcStorageProfile } from './updateVdcStorageProfile';
import { deleteVdc } from './deleteVdc';
import { enableVdc } from './enableVdc';
import { disableVdc } from './disableVdc';
import { updateNetworkProfile } from './updateNetworkProfile';

export const adminVdcWrapper = {
  createVdc: createVdc,
  updateVdc: updateVdc,
  updateVdcStorageProfile: updateVdcStorageProfile,
  deleteVdc: deleteVdc,
  disableVdc: disableVdc,
  enableVdc: enableVdc,
  updateNetworkProfile: updateNetworkProfile,
};

