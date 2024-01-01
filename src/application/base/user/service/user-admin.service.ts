import { Injectable } from '@nestjs/common';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { AccessTokenTableService } from '../../crud/access-token-table/access-token-table.service';
import { NotificationService } from '../../notification/notification.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { encryptPassword } from 'src/infrastructure/helpers/helpers';
import { GroupsMappingTableService } from '../../crud/groups-mapping-table/groups-mapping-table.service';
import { Groups } from 'src/infrastructure/database/entities/Groups';
import { GroupsTableService } from '../../crud/groups-table/groups-table.service';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { FilteredUser } from '../types/filtered-user.type';
import { FindOptionsSelect, Like } from 'typeorm';
import { User } from 'src/infrastructure/database/entities/User';
import { PaginationReturnDto } from 'src/infrastructure/dto/pagination-return.dto';
import { SystemErrorDto } from '../dto/system-error.dto';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { VusersTableService } from '../../crud/vusers-table/vusers-table.service';
import { VUsers } from 'src/infrastructure/database/entities/views/v-users';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';

@Injectable()
export class UserAdminService {
  userFilter: FindOptionsSelect<User> = {
    id: true,
    realm: true,
    username: true,
    email: true,
    name: true,
    family: true,
    deleted: true,
    createDate: true,
    updateDate: true,
    credit: true,
    hasVdc: true,
    phoneNumber: true,
    orgName: true,
    acceptTermsOfService: true,
    phoneVerified: true,
    active: true,
  };

  constructor(
    private readonly userTable: UserTableService,
    private readonly logger: LoggerService,
    private readonly accessTokenTable: AccessTokenTableService,
    private readonly notificationService: NotificationService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly groupMappingTable: GroupsMappingTableService,
    private readonly groupTable: GroupsTableService,
    private readonly vUsersTableService: VusersTableService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await encryptPassword(createUserDto.password);
    return await this.userTable.create(createUserDto);
  }

  async deleteUsers(options: SessionRequest, userId: number): Promise<void> {
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
      { ...options.user },
    );
    return;
  }

  async disableUser(options: SessionRequest, userId: number): Promise<void> {
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
    await this.accessTokenTable.deleteAll({ userId: userId.toString() });
    await this.logger.info(
      'user',
      'adminDisableUser',
      {
        username: user.username,
        _object: user.id.toString(),
      },
      { ...options.user },
    );
    return;
  }

  async enableUser(options: SessionRequest, userId: number): Promise<void> {
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
      { ...options.user },
    );
    return;
  }

  async getUserInfo(userId: number): Promise<FilteredUser> {
    const user = await this.userTable.findById(userId);
    if (!user) {
      return Promise.reject(new ForbiddenException());
    }
    const { password, vdcPassword, ...retVal } = user;
    console.log(password == vdcPassword ? '' : ''); // prevent lint warning
    return retVal;
  }

  // async getUsers(
  //   // role: string,
  //   active: boolean,
  //   page: number,
  //   pageSize: number,
  //   name: string,
  //   username: string,
  //   family: string,
  // ): Promise<PaginationReturnDto<User>> {
  //   let skip = 0;
  //   let limit = 10;
  //   if (!isEmpty(page)) {
  //     skip = pageSize * (page - 1);
  //   }
  //   const where = isNil(username || name || family || limit)
  //     ? {}
  //     : {
  //         username: username ? Like(`%${username}%`) : undefined,
  //         active: active,
  //         name: name ? Like(`%${name}%`) : undefined,
  //         family: family ? Like(`%${family}%`) : undefined,
  //         // roleId: role,
  //       };
  //   if (!isEmpty(pageSize)) {
  //     limit = pageSize;
  //   }
  //   console.log(where);

  //   const users = await this.userTable.find({
  //     where,
  //     take: pageSize,
  //     skip,
  //     select: this.userFilter,
  //   });
  //   const countAll = await this.userTable.count({ where: where });
  //   return Promise.resolve({
  //     total: countAll,
  //     page,
  //     pageSize,
  //     record: users,
  //   });
  // }

  // async impersonateAsUser(options: SessionRequest, data: ) {
  //   const { userId } = data;
  //   const user = await this.userTable.findById(userId);
  //   if (!user) {
  //     return Promise.reject(new ForbiddenException());
  //   }
  //   const adminId = options.accessToken.userId;
  //   const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  //   const payload = {
  //     id: adminId,
  //     impersonateAs: userId,
  //   };
  //   const token = jwt.sign(payload, JWT_SECRET_KEY, {
  //     expiresIn: 3600 * 1,
  //   });
  //   return Promise.resolve({ token });
  // }

  async systemError(data: SystemErrorDto): Promise<void> {
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

  async updateUserCredit(
    options: SessionRequest,
    credit: number,
    userId: number,
  ): Promise<void> {
    const user = await this.userTable.findById(userId);
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.transactionsTable.create({
      userId: user.id.toString(),
      dateTime: new Date(),
      value: credit,
      invoiceId: null,
      description: 'INC',
      paymentType: PaymentTypes.PayToUserCreditByAdmin,
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
      { ...options.user },
    );
    return;
  }

  async getUserGroups(userId: number): Promise<Groups[]> {
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

  async updateUserGroups(
    options: SessionRequest,
    userId: number,
    data: number[],
  ): Promise<number[]> {
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
      { ...options.user },
    );
    return updatedGroups;
  }

  async updateUser(
    options: SessionRequest,
    userId: number,
    data: UpdateUserAdminDto,
  ): Promise<void> {
    const user = await this.userTable.findOne({
      where: {
        id: userId,
      },
    });
    if (isNil(user)) {
      return Promise.reject(new ForbiddenException());
    }
    await this.userTable.update(userId, {
      name: data.name,
      family: data.family,
      birthDate: data.birthDate,
      email: data.email,
    });
    return;
  }

  async getUsers(): Promise<VUsers[]> {
    const users = await this.vUsersTableService.find();
    return users;
  }
}
