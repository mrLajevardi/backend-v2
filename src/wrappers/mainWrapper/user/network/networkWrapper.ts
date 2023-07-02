import { userCreateNetwork } from './createNetwork';
import { userDeleteNetwork } from './deleteNetwork';
import { userGetNetwork } from './getNetwork';
import { userUpdateNetwork } from './updateNetwork';
import { getIPUsageNetwrok } from './getIPUsageNetwrok';

export const networkWrapper = {
  createNetwork: userCreateNetwork,
  deleteNetwork: userDeleteNetwork,
  getNetwork: userGetNetwork,
  updateNetwork: userUpdateNetwork,
  getIPUsageNetwrok: getIPUsageNetwrok,
};

