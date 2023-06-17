const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
   * @param {Object} config config for updating vdc
   * @param {String} vdcId
   * @param {Object} config.providerVdcStorageProfile link to an storage policy
   * @param {String} config.name name of storage profile
   * @param {Number} config.storage hard disk capacity
   * @param {Boolean} config.default if storage profile is default or not
   * @param {String} config.units unit of hard disk eg: GB, MB
   * @param {String} config.authToken provider auth token
   * @return {Promise}
   */
async function updateVdcStorageProfile(config, vdcId) {
  const queryOptions = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    params: {
      type: 'adminOrgVdcStorageProfile',
      page: 1,
      pageSize: 15,
      format: 'records',
      filter: `(vdc==${vdcId})`,
    },
  };
  const storageProfile = await new VcloudWrapper().posts('user.vdc.vcloudQuery', queryOptions);
  const storageProfileLink = storageProfile.data.record[0].href;
  const request = {
    name: config.name,
    default: config.default,
    units: config.units,
    limit: config.storage * 1024,
    enabled: true,
    providerVdcStorageProfile: config.providerVdcStorageProfile,

  };
  const options = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    fullUrl: storageProfileLink,
    body: request,
  };
  const updatedVdc = await new VcloudWrapper()
      .posts('admin.vdc.updateVdcStorageProfile', options);
  return Promise.resolve(updatedVdc.data);
}

module.exports = updateVdcStorageProfile;
