import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
export class createSessionWrapper {
  /**
   * base session
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @param {Boolean} isProvider
   * @return {Promise}
   */
  async session(username, password, orgName, isProvider = false) {
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
      response = await new VcloudWrapper().posts(
        'admin.user.createProviderSession',
        options,
      );
    } else {
      response = await new VcloudWrapper().posts(
        'admin.user.createUserSession',
        options,
      );
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
  async providerSession(username, password, orgName) {
    return await this.session(username, password, orgName, true);
  }
  /**
   * user login
   * @param {String} username
   * @param {String} password
   * @param {String} orgName
   * @return {Promise}
   */
  async userSession(username, password, orgName) {
    return await this.session(username, password, orgName);
  }

  public async createSession() {
    return {
      providerSession: await this.providerSession,
      userSession: await this.userSession,
    };
  }
}
