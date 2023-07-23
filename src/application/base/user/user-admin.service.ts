import { Injectable } from '@nestjs/common';
import { UserTableService } from '../crud/user-table/user-table.service';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { AccessTokenTableService } from '../crud/access-token-table/access-token-table.service';
import { NotificationService } from '../notification/notification.service';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import jwt from 'jsonwebtoken';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly logger: LoggerService,
    private readonly accessTokenTable: AccessTokenTableService,
    private readonly notificationService: NotificationService,
    private readonly transactionsTable: TransactionsTableService,
  ) {}

  async deleteUsers(options, userId) {
    const user = await this.userTable.findById(userId);
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.userTable.updateAll(
      { id: userId },
      {
        deleted: true,
      },
    );
    await this.logger.info(
      'user',
      'adminDeleteUser',
      {
        username: user.username,
        _object: user.id,
      },
      { ...options.locals },
    );
    return;
  }

  async disableUsers(options, userId) {
    const user = await this.userTable.findById(userId);
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.userTable.updateAll(
      { id: userId },
      {
        active: false,
      },
    );
    await this.accessTokenTable.deleteAll({ userId: userId });
    await this.logger.info(
      'user',
      'adminDisableUser',
      {
        username: user.username,
        _object: user.id,
      },
      { ...options.locals },
    );
    return;
  }

  async enableUsers(options, userId) {
    const user = await this.userTable.findById(userId);
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.userTable.updateAll(
      { id: userId },
      {
        active: true,
      },
    );
    await this.logger.info(
      'user',
      'adminEnableUser',
      {
        username: user.username,
        _object: user.id,
      },
      { ...options.locals },
    );
    return;
  }

  async getUserInfo(options, userId) {
    const user = await this.userTable.findById(userId);
    if (!user) {
      return Promise.reject(new ForbiddenException());
    }
    // const userGroups = await app.models.UserGroups.find({
    //   where: {
    //     UserID: userId,
    //   },
    // });
    // const userPermissionGroups = await app.models.UserPermissionGroups.find({
    //   where: {
    //     UserID: userId,
    //   },
    // });
    // user.groups = userGroups;
    // user.permissionGroups = userPermissionGroups;
    return Promise.resolve(user);
  }

  async getUsers(options, role, page, pageSize, name, username, family) {
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }
    const where = isNil(username || name || family || limit)
      ? {}
      : {
          and: [
            { username: username ? { like: `%${username}%` } : undefined },
            { name: name ? { like: `%${name}%` } : undefined },
            { family: family ? { like: `%${family}%` } : undefined },
            { roleId: role },
          ],
        };
    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }
    console.log(where);
    // const users = await app.models.UsersRole.find({
    //   where,
    //   limit: pageSize,
    //   skip,
    // });
    // const countAll = await app.models.UsersRole.count(where);
    // return Promise.resolve({
    //   total: countAll,
    //   page,
    //   pageSize,
    //   record: users,
    // });
  }

  async impersonateAsUser(options, data) {
    const { userId } = data;
    const user = await this.userTable.findById(userId);
    if (!user) {
      return Promise.reject(new ForbiddenException());
    }
    const adminId = options.accessToken.userId;
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const payload = {
      id: adminId,
      impersonateAs: userId,
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: 3600 * 1,
    });
    return Promise.resolve({ token });
  }

  async systemError(options, data) {
    const { text, isHtml, title } = data;
    const users = [
      {
        email: 'lajevardi321@gmail.com',
        phoneNumber: '09389071489',
      },
      {
        email: 'jalaly.bi@gmail.com',
        phoneNumber: '09122526683',
      },
      {
        email: 'mortezamofa@yahoo.com',
        phoneNumber: '09231047637',
      },
      {
        email: 'lajevardi321@gmail.com', // latifi
        phoneNumber: '09127543147',
      },
    ];
    const subject = title;
    for (const user of users) {
      const options = {
        subject,
        to: user.email,
      };
      if (isHtml) {
        options['html'] = text;
      } else {
        options['text'] = text;
      }
      await this.notificationService.sms.sendSMS(
        user.phoneNumber,
        'systemError',
      );
      await this.notificationService.email.sendMail(options);
    }
    return Promise.resolve();
  }

  async updateUserCredit(options, credit, userId) {
    const user = await this.userTable.findById(userId);
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.userTable.updateAll(
      { id: userId },
      {
        credit: user.credit + credit,
      },
    );
    await this.transactionsTable.create({
      userId: user.id.toString(),
      dateTime: new Date(),
      value: credit,
      invoiceId: null,
      description: 'INC',
      paymentType: 3,
      paymentToken: null,
      isApproved: true,
      serviceInstanceId: null,
    });
    await this.logger.info(
      'user',
      'adminUpdateUserCredit',
      {
        username: user.username,
        credit,
        _object: user.id,
      },
      { ...options.locals },
    );
    return;
  }

  async updateUsers(options, userId, data) {
    const user = await this.userTable.findOne({
      where: {
        id: userId,
      },
    });
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    const newData = { ...data };
    delete newData.groups;
    delete newData.roles;
    delete newData.username;
    delete newData.email;
    console.log('❤️');
    if (Object.keys(newData).length > 0) {
      await this.userTable.updateAll({ id: userId }, newData);
      await this.logger.info(
        'user',
        'adminUpdateUser',
        {
          username: user.username,
          data,
          _object: user.id,
        },
        { ...options.locals },
      );
    }
    // console.log('❤️👌');
    // await app.models.GroupsMapping.destroyAll({
    //   UserID: userId,
    // });
    // if (data.groups) {
    //   for (const group of data.groups) {
    //     const groupExists = await app.models.GroupsMapping.findOne({
    //       where: {
    //         and: [
    //           {GroupID: group},
    //           {UserID: userId},
    //         ],
    //       },
    //     });
    //     if (! groupExists) {
    //       await app.models.GroupsMapping.create({
    //         UserID: userId,
    //         GroupID: group,
    //         CreateDate: new Date().toISOString(),
    //       });
    //     }
    //   }
    // }
    console.log('👌');
    await this.logger.info(
      'user',
      'updateUserGroups',
      {
        username: user.username,
        _object: user.id,
      },
      { ...options.locals },
    );
    // await app.models.RoleMappings.destroyAll({
    //   principalId: userId,
    // });
    // console.log(data.roles, '💀');
    // for (const role of data.roles) {
    //   const roleExists = await app.models.RoleMappings.findOne({
    //     where: {
    //       and: [
    //         {roleId: role},
    //         {principalId: userId},
    //       ],
    //     },
    //   });
    //   console.log('first');
    //   if (! roleExists) {
    //     await app.models.RoleMappings.create({
    //       principalId: userId,
    //       roleId: role,
    //       principalType: 'USER',
    //     });
    //   }
    // }
    return;
  }
}
