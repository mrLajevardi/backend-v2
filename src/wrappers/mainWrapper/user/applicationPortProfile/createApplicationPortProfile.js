const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {Object} config
 * @param {Object} config.description
 * @param {Object} config.name
 * @param {Object} config.vdcId
 * @param {Object} config.orgId
 * @param {Object} config.applicationPorts
 * @return {Promise}
 */
async function userCreateApplicationPortProfile(authToken, config) {
  const requestBody = {
    name: config.name,
    description: config.description,
    applicationPorts: config.applicationPorts,
    orgRef: {
      id: config.orgId,
    },
    contextEntityId: config.vdcId,
    scope: 'TENANT',
  };
  const options = {
    headers: {Authorization: `Bearer ${authToken}`},
    body: requestBody,
  };
  const applicationPortProfile = await new VcloudWrapper()
      .posts('user.applicationPortProfiles.createApplicationPortProfile', options);
  return Promise.resolve({
    __vcloudTask: applicationPortProfile.headers['location'],
  });
}

module.exports = userCreateApplicationPortProfile;
