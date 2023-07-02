import { VcloudWrapper } from "src/wrappers/vcloudWrapper/vcloudWrapper";

export class AdminUserWrapper {
  constructor() {
    
  }

  async session(
    username: string,
    password: string,
    orgName: string,
    isProvider: boolean = false
  ) {
    // convert username@organization:password to base64
    const basicAuth = Buffer.from(
      `${username}@${orgName}:${password}`
    ).toString("base64");
    const options = {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      body: {},
    };
    let response;
    if (isProvider) {
      response = await new VcloudWrapper().posts(
        "admin.user.createProviderSession",
        options
      );
    } else {
      response = await new VcloudWrapper().posts(
        "admin.user.createUserSession",
        options
      );
    }
    // extract session id from header
    const sessionId = response.headers["set-cookie"][1]
      .split("=")[1]
      .replace(";Path", "");
    const sessionToken = response.headers["x-vmware-vcloud-access-token"];
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
  async providerSession(username: string, password: string, orgName: string) {
    return await this.session(username, password, orgName, true);
  }

  /**
   * user login
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @return {Promise}
   */
  async userSession(username: string, password: string, orgName: string) {
    return await this.session(username, password, orgName);
  }

  public async createUser(config) {
    const vcloudQueryOptions = {
      headers: {
        "x-vcloud-authorization": config.orgName,
        "x-vmware-vcloud-auth-context": config.orgName,
        "x-vmware-vcloud-tenant-context": config.orgId.split(":").slice(-1),
        Authorization: `Bearer ${config.authToken}`,
      },
      params: {
        type: "role",
        page: 1,
        pageSize: 20,
        filterEncoded: true,
        filter: "(name==*Organization Administrator*)",
        sortAsc: "name",
      },
    };
    let roleId = await new VcloudWrapper().posts(
      "user.vdc.vcloudQuery",
      vcloudQueryOptions
    );
    // parse data to get role id
    roleId = roleId.data.record[0].href.split("role/")[1];
    const requestBody = {
      storedVmQuota: 0,
      deployedVmQuot: 0,
      isEnabled: true,
      name: config.username,
      password: config.password,
      role: {
        vCloudExtension: null,
        href: `${VcloudWrapper.baseUrl}/api/admin/role/` + roleId,
        type: "application/vnd.vmware.admin.role+xml",
        link: null,
      },
      fullName: null,
      emailAddress: null,
      telephone: null,
      im: null,
    };
    const formattedOrgId = config.orgId.split(":").slice(-1);
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      body: requestBody,
      urlParams: { orgId: formattedOrgId },
    };
    const response = await new VcloudWrapper().posts(
      "admin.user.createUser",
      options
    );
    return Promise.resolve(response.data);
  }
}
