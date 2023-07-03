import { createApplicationPortProfilesEndpoint } from './createApplicationPortProfileEndpoint';
import { deleteApplicationPortProfilesEndpoint } from './deleteApplicationPortProfileEndpoint';
import { getApplicationPortProfileEndpoint } from './getApplicationPortProfileEndpoint';
import { getApplicationPortProfilesListEndpoint } from './getApplicationPortProfilesListEndpoint';
import { updateApplicationPortProfilesEndpoint } from './updateApplicationPortProfileEndpoint';

export const applicationPortProfilesEndpoints = {
  createApplicationPortProfile: createApplicationPortProfilesEndpoint,
  deleteApplicationPortProfile: deleteApplicationPortProfilesEndpoint,
  updateApplicationPortProfile: updateApplicationPortProfilesEndpoint,
  getApplicationPortProfilesList: getApplicationPortProfilesListEndpoint,
  getApplicationPortProfile: getApplicationPortProfileEndpoint,
};

