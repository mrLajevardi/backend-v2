const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {String} applicationId
 * @param {Object} config
 * @param {Object} config.description
 * @param {Object} config.name
 * @param {Object} config.vdcId
 * @param {Object} config.orgId
 * @param {Object} config.applicationPorts
 * @return {Promise}
 */
async function userUpdateApplicationPortProfile(authToken, applicationId, config) {
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
    urlParams: {applicationId},
    body: requestBody,
  };
  const response = await new VcloudWrapper()
      .posts('user.applicationPortProfiles.updateApplicationPortProfile', options);
  return Promise.resolve({
    __vcloudTask: response.headers['location'],
  });
}

module.exports = userUpdateApplicationPortProfile;
