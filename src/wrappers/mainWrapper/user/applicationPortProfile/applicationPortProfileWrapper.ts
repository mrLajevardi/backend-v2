import { userCreateApplicationPortProfile } from './createApplicationPortProfile';
import { userDeleteApplicationPortProfile } from './deleteApplicationPortProfiles';
import { userGetApplicationPortProfiles } from './getApplicationPortProfiles';
import { userGetSingleApplicationPortProfile } from './getSingleApplicationPortProfile';
import { userUpdateApplicationPortProfile } from './updateApplicationPortProfile';

export const applicationPortProfilesWrapper = {
  getApplicationPortProfile: userGetSingleApplicationPortProfile,
  createApplicationPortProfile: userCreateApplicationPortProfile,
  updateApplicationPortProfile: userUpdateApplicationPortProfile,
  deleteApplicationPortProfile: userDeleteApplicationPortProfile,
  getApplicationPortProfileList: userGetApplicationPortProfiles,
};

