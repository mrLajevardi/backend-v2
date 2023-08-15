import { Injectable } from '@nestjs/common';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';

@Injectable()
export class AdminUserWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   * @param {Object} config
   * @param {String} config.orgId org id stored in server
   * @param {String} config.orgName org name stored in server
   * @param {String} config.roleId global role id in vm sever
   * @param {String} config.authToken
   * @param {string} config.username
   * @param {string} config.password
   */
  async createUser(config) {
    const vcloudQueryOptions = {
      headers: {
        'x-vcloud-authorization': config.orgName,
        'x-vmware-vcloud-auth-context': config.orgName,
        'x-vmware-vcloud-tenant-context': config.orgId.split(':').slice(-1),
        Authorization: `Bearer ${config.authToken}`,
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
    const endpoint = 'VdcEndpointService.vcloudQueryEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    let roleId: any = await this.vcloudWrapperService.request(
      wrapper(vcloudQueryOptions),
    );
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
        href: `${vcdConfig.baseUrl}/api/admin/role/` + roleId,
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
      headers: { Authorization: `Bearer ${config.authToken}` },
      body: requestBody,
      urlParams: { orgId: formattedOrgId },
    };
    const userEndpoint = 'AdminUserEndpointService.createUserEndpoint';
    const userWrapper =
      this.vcloudWrapperService.getWrapper<typeof userEndpoint>(userEndpoint);
    const response: any = await this.vcloudWrapperService.request(
      userWrapper(options),
    );
    return Promise.resolve(response.data);
  }
  /**
   * base session
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @param {Boolean} isProvider
   * @return {Promise}
   */
  async session(
    username: string,
    password: string,
    orgName: string,
    isProvider = false,
  ): Promise<any> {
    // convert username@organization:password to base64
    const basicAuth = Buffer.from(
      `${username}@${orgName}:${password}`,
    ).toString('base64');
    const options = {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      body: {},
    };
    let response;
    if (isProvider) {
      const endpoint = 'AdminUserEndpointService.createProviderSessionEndpoint';
      const wrapper =
        this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
      response = await this.vcloudWrapperService.request(wrapper(options));
    } else {
      const endpoint = 'AdminUserEndpointService.createUserSessionEndpoint';
      const wrapper =
        this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
      response = await this.vcloudWrapperService.request(wrapper(options));
    }
    // extract session id from header
    const sessionId = response.headers['set-cookie'][1]
      .split('=')[1]
      .replace(';Path', '');
    const sessionToken = response.headers['x-vmware-vcloud-access-token'];
    return Promise.resolve({
      sessionId: sessionId,
      token: sessionToken,
    });
  }

  /**
   * provider session
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @return {Promise}
   */
  async providerSession(
    username: string,
    password: string,
    orgName: string,
  ): Promise<any> {
    return await this.session(username, password, orgName, true);
  }

  /**
   * user login
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @return {Promise}
   */
  async userSession(
    username: string,
    password: string,
    orgName: string,
  ): Promise<any> {
    return await this.session(username, password, orgName);
  }
}
