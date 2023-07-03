import { createNatEndpoint } from './createNatEndpoint';
import { deleteNatEndpoint } from './deleteNatLEndpoint';
import { getNatEndpoint } from './getNatEndpoint';
import { getNatListEndpoint } from './getNatListEndpoint';
import { updateNatEndpoint } from './updateNatEndpoint';

export const natEndpoints = {
  getNatList: getNatListEndpoint,
  deleteNat: deleteNatEndpoint,
  getNat: getNatEndpoint,
  updateNat: updateNatEndpoint,
  createNat: createNatEndpoint,
};
