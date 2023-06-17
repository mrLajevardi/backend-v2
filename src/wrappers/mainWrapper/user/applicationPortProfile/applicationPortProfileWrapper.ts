const userCreateApplicationPortProfile = require('./createApplicationPortProfile');
const userDeleteApplicationPortProfile = require('./deleteApplicationPortProfiles');
const userGetApplicationPortProfiles = require('./getApplicationPortProfiles');
const userGetSingleApplicationPortProfile = require('./getSingleApplicationPortProfile');
const userUpdateApplicationPortProfile = require('./updateApplicationPortProfile');

const applicationPortProfilesWrapper = {
  getApplicationPortProfile: userGetSingleApplicationPortProfile,
  createApplicationPortProfile: userCreateApplicationPortProfile,
  updateApplicationPortProfile: userUpdateApplicationPortProfile,
  deleteApplicationPortProfile: userDeleteApplicationPortProfile,
  getApplicationPortProfileList: userGetApplicationPortProfiles,
};

module.exports = applicationPortProfilesWrapper;
