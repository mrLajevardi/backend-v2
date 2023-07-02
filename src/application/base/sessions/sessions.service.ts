import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { UserTableService } from '../crud/user-table/user-table.service';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { vcdAuthConfig } from 'src/wrappers/mainWrapper/vcdAuthConfig';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionTable: SessionsTableService,
    private readonly userTable: UserTableService,
    private readonly organizationTable: OrganizationTableService
    ) {}

  async createAdminSession(userId) {

    const adminUser = mainWrapper.admin.user;
    const sessionData = await adminUser.providerSession(vcdAuthConfig.username, 
      vcdAuthConfig.password, vcdAuthConfig.org);

    await this.sessionTable.create({
      isAdmin: true,
      orgId: null, // DOUBLE CHECK THIS PART , this part changed after MOVE
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      active: true,
      createDate: new Date(),
      updateDate: new Date(),
    });
    return Promise.resolve(sessionData);
  }

  async createUserSession(orgId, userId) {
    const user = await this.userTable.findById(userId);
    const org = await this.organizationTable.findById(orgId);
    const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    //This part is because of preventing errors and should be deleted
    //
    const sessionData = await mainWrapper.admin.user.
        userSession(filteredUsername, user.vdcPassword, org.name);
    this.sessionTable.create({
      isAdmin: false,
      orgId,
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      active: true,
      createDate: new Date(),
      updateDate: new Date(),
    });
    return Promise.resolve(sessionData);
  }

  /**
   * checks admin session
   * @return {Promise}
   */
  async checkAdminSession(userId: string) {
    const session = await this.sessionTable.findOne({
      where: {
        isAdmin: true, 
        active: true,
      },
    });
    if (session) {
      const currentDate = new Date().getTime() + 1000 * 60;
      const sessionExpire =
        new Date(session.createDate).getTime() + 1000 * 60 * 30;
      if (sessionExpire > currentDate) {
        return Promise.resolve(session.token);
      } else {
        await this.sessionTable.update(session.id, {
          active: false,
        });
        //const adminSession = new AdminSession(this.userId, t);
        const createdSession = await this.createAdminSession(userId);
        return Promise.resolve(createdSession.token);
      }
    } else {
      // const adminSession = new AdminSession(null,this.userId);
      const createdSession = await this.checkAdminSession(userId);
      return Promise.resolve(createdSession.token);
    }
  }

  /**
   * @param {String} orgId
   * @return {Promise}
   */
  async checkUserSession(orgId, userId) {
    const session = await this.sessionTable.findOne({
      where: {
        orgId: orgId, 
        active: true,
      },
    });
    if (session) {
      const currentDate = new Date().getTime() + 1000 * 60;
      const sessionExpire =
        new Date(session.createDate).getTime() + 1000 * 60 * 30;
      if (sessionExpire > currentDate) {
        return Promise.resolve(session.token);
      } else {
        await this.sessionTable.update(session.id, {
          active: false,
        });
        const createdSession = await this.createUserSession(orgId, userId);
        return Promise.resolve(createdSession.token);
      }
    } else {
      const createdSession = await this.createUserSession(orgId, userId);
      return Promise.resolve(createdSession.token);
    }
  }
}
