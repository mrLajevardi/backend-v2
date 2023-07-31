import { Injectable } from '@nestjs/common';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { AccessTokenTableService } from '../../crud/access-token-table/access-token-table.service';
import { NotificationService } from '../../notification/notification.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { encryptPassword } from 'src/infrastructure/helpers/helpers';
import { GroupsMappingTableService } from '../../crud/groups-mapping-table/groups-mapping-table.service';
import { Groups } from 'src/infrastructure/database/entities/Groups';
import { GroupsTableService } from '../../crud/groups-table/groups-table.service';

@Injectable()
export class UserAdminService {
  userFilter = [
    'id',
    'realm',
    'username',
    'email',
    'name',
    'family',
    'deleted',
    'createDate',
    'updateDate',
    'credit',
    'hasVdc',
    'phoneNumber',
    'orgName',
    'acceptTermsOfService',
    'phoneVerified',
  ];

  constructor(
    private readonly userTable: UserTableService,
    private readonly logger: LoggerService,
    private readonly accessTokenTable: AccessTokenTableService,
    private readonly notificationService: NotificationService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly groupMappingTable: GroupsMappingTableService,
    private readonly groupTable: GroupsTableService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    createUserDto.password = await encryptPassword(createUserDto.password);
    return await this.userTable.create(createUserDto);
  }

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
        _object: user.id.toString(),
      },
      { ...options.locals },
    );
    return;
  }

  async disableUser(options, userId) {
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
        _object: user.id.toString(),
      },
      { ...options.locals },
    );
    return;
  }

  async enableUser(options, userId) {
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
        _object: user.id.toString(),
      },
      { ...options.locals },
    );
    return;
  }

  async getUserInfo(userId): Promise<any> {
    const user = await this.userTable.findById(userId);
    if (!user) {
      return Promise.reject(new ForbiddenException());
    }
    const { password, vdcPassword, ...retVal } = user;
    return retVal;
  }

  async getUsers(role, page, pageSize, name, username, family) {
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }
    const where = isNil(username || name || family || limit)
      ? {}
      : {
          username: username ? { like: `%${username}%` } : undefined,
          name: name ? { like: `%${name}%` } : undefined,
          family: family ? { like: `%${family}%` } : undefined,
          roleId: role,
        };
    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }
    console.log(where);
    const users = await this.userTable.find({
      where,
      take: pageSize,
      skip,
      select: this.userFilter,
    });
    const countAll = await this.userTable.count({ where: where });
    return Promise.resolve({
      total: countAll,
      page,
      pageSize,
      record: users,
    });
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
        _object: user.id.toString(),
      },
      { ...options.locals },
    );
    return;
  }

  async getUserGroups(userId): Promise<Groups[]> {
    const user = await this.userTable.findOne({
      where: {
        id: userId,
      },
    });
    if (isNil(user) || isNil(userId)) {
      return Promise.reject(new ForbiddenException());
    }
    const groupsMapping = await this.groupMappingTable.find({
      where: {
        userId: userId,
      },
      relations: ['group'],
    });
    const groups = await Promise.all(
      groupsMapping.map(async (groupMapping) => {
        const group = await groupMapping.group;
        return group;
      }),
    );

    return groups;
  }

  async updateUserGroups(options, userId, data: number[]): Promise<number[]> {
    const user = await this.userTable.findOne({
      where: {
        id: userId,
      },
    });
    if (isNil(user) || isNil(userId)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.groupMappingTable.deleteAll({
      userId: userId,
    });
    console.log(data);
    const updatedGroups = [];
    for (const group of data) {
      const groupExists = await this.groupTable.findOne({
        where: {
          id: group,
        },
      });

      if (groupExists) {
        const groupMappingExists = await this.groupMappingTable.findOne({
          where: {
            groupId: group,
            userId: userId,
          },
        });

        if (!groupMappingExists) {
          await this.groupMappingTable.create({
            userId: userId,
            groupId: group,
            createDate: new Date(),
          });
          updatedGroups.push(group);
        }
      }
    }
    await this.logger.info(
      'user',
      'updateUserGroups',
      {
        username: user.username,
        _object: user.id.toString(),
      },
      { ...options.locals },
    );
    return updatedGroups;
  }

  async updateUser(options, userId, data) {
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
          _object: user.id.toString(),
        },
        { ...options.locals },
      );
    }

    console.log('❤️👌');
    await this.groupMappingTable.deleteAll({
      userId: userId,
    });
    if (data.groups) {
      for (const group of data.groups) {
        const groupMapExists = await this.groupMappingTable.findOne({
          where: {
            GroupID: group,
            UserID: userId,
          },
        });
        if (!groupMapExists) {
          const groupExists = await this.groupTable.findOne(group);
          if (groupExists) {
            await this.groupMappingTable.create({
              userId: userId,
              groupId: group,
              createDate: new Date(),
            });
          }
        }
      }
    }
    console.log('👌');
    await this.logger.info(
      'user',
      'updateUserGroups',
      {
        username: user.username,
        _object: user.id.toString(),
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
