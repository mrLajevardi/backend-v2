import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionsTableService } from '../crud/sessions-table/sessions-table.service';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionTable: SessionsTableService) {}

  async createAdminSession(userId) {
    throw new InternalServerErrorException('MUST BE IMPLEMENTED');
    //This part is because of preventing errors and should be deleted
    const sessionData = { sessionId: '1', token: '' };
    // const sessionData = await mainWrapper.admin.user.createSession()
    //     .providerSession(
    //         vcdAuth.username, vcdAuth.password, this.sysOrgName,
    //     );
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
    // const user = await this.userService.findById(userId);
    // const org = await this.organizationService.findById(orgId);
    //const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    throw new InternalServerErrorException('MUST BE IMPLEMENTED');
    //This part is because of preventing errors and should be deleted
    const sessionData = { sessionId: '1', token: '' };
    //
    // const sessionData = await mainWrapper.admin.user.createSession()
    //     .userSession(filteredUsername, user.vdcPassword, org.name);
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
        and: [{ isAdmin: true }, { active: true }],
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
        and: [{ orgId }, { active: true }],
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
