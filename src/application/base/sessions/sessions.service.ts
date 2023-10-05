import { Injectable } from '@nestjs/common';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { UserTableService } from '../crud/user-table/user-table.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { vcdAuthConfig } from 'src/wrappers/mainWrapper/vcdAuthConfig';
import { log } from 'console';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionTable: SessionsTableService,
    private readonly userTable: UserTableService,
    private readonly organizationTable: OrganizationTableService,
  ) {}

  async createAdminSession(): Promise<{
    username: string;
    password: string;
    org: string;
    token: string;
  }> {
    const orgId: number = parseInt(vcdAuthConfig.org);
    const session = mainWrapper.admin.user.createSession;
    const sessionData = await session.providerSession(
      vcdAuthConfig.username,
      vcdAuthConfig.password,
      vcdAuthConfig.org,
    );
    return Promise.resolve(sessionData);
  }

  async createUserSession(
    orgId: number,
    userId: number,
  ): Promise<{
    filteredUsername: string;
    vdcPassword: string;
    orgName: string;
    token: string;
  }> {
    const user = await this.userTable.findById(userId);
    const org = await this.organizationTable.findById(orgId);
    const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    //This part is because of preventing errors and should be deleted
    //
    const session = mainWrapper.admin.user.createSession;
    // const sessionData = await session.userSession(
    //   filteredUsername,
    //   user.vdcPassword,
    //   org.name
    // );
    const sessionData = await session.userSession(
      filteredUsername,
      user.vdcPassword,
      org.name,
    );
    // const sessionData = await mainWrapper.admin.user.
    //     userSession(filteredUsername, user.vdcPassword, org.name);
    return Promise.resolve(sessionData);
  }

  /**
   * checks admin session
   * @return {Promise}
   */
  async checkAdminSession(): Promise<string> {
      const createdSession = await this.createAdminSession();
      return Promise.resolve(createdSession.token);
  }

  /**
   * @param {String} orgId
   * @return {Promise}
   */
  async checkUserSession(userId: number, orgId: number): Promise<string> {
      const createdSession = await this.createUserSession(orgId, userId);
      return Promise.resolve(createdSession.token);
  }
}
