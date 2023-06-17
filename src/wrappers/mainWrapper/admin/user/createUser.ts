const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
     * @param {Object} config
     * @param {String} config.orgId org id stored in server
     * @param {String} config.orgName org name stored in server
     * @param {String} config.roleId global role id in vm sever
     * @param {String} config.authToken
     * @param {string} config.username
     * @param {string} config.password
     */
export async function createUser(config) {
  const vcloudQueryOptions = {
    headers: {
      'x-vcloud-authorization': config.orgName,
      'x-vmware-vcloud-auth-context': config.orgName,
      'x-vmware-vcloud-tenant-context': config.orgId.split(':').slice(-1),
      'Authorization': `Bearer ${config.authToken}`,
    },
    params: {
      type: 'role',
      page: 1,
      pageSize: 20,
      filterEncoded: true,
      filter: '(name==*Organization Administrator*)',
      sortAsc: 'name',
    },
  };
  let roleId = await new VcloudWrapper().posts('user.vdc.vcloudQuery', vcloudQueryOptions);
  // parse data to get role id
  roleId = roleId.data.record[0].href.split('role/')[1];
  const requestBody = {
    storedVmQuota: 0,
    deployedVmQuot: 0,
    isEnabled: true,
    name: config.username,
    password: config.password,
    role: {
      vCloudExtension: null,
      href: `${VcloudWrapper.baseUrl}/api/admin/role/` + roleId,
      type: 'application/vnd.vmware.admin.role+xml',
      link: null,
    },
    fullName: null,
    emailAddress: null,
    telephone: null,
    im: null,
  };
  const formattedOrgId = config.orgId.split(':').slice(-1);
  const options = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    body: requestBody,
    urlParams: {orgId: formattedOrgId},
  };
  const response = await new VcloudWrapper().posts('admin.user.createUser', options);
  return Promise.resolve(response.data);
}

module.exports = createUser;

