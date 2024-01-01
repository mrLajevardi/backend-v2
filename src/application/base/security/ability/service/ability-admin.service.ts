import { Injectable } from '@nestjs/common';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { Action } from '../enum/action.enum';
import { PredefinedRoles } from '../enum/predefined-enum.type';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { In } from 'typeorm';
import { getStringListOfAbilities } from '../ability.factory';
import { GetAllAclsDto } from '../dto/get-all-acls.dto';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { User } from 'src/infrastructure/database/entities/User';
import { HookTypeEnum } from 'src/application/base/crud/acl-table/enum/hook-type.enum';

@Injectable()
export class AbilityAdminService {
  constructor(
    private readonly aclTable: ACLTableService,
    private readonly userTable: UserTableService,
  ) {}

  getListOfModels(): string[] {
    return getStringListOfAbilities();
  }

  async getUsersWithPredefinedRole(role: string): Promise<User[]> {
    const aclEntries = await this.aclTable.find({
      select: ['roleId'],
      where: {
        model: role,
        // principalType: 'User',
        // permission: 'can',
      },
    });
    const userIds = aclEntries.map((entry) => entry.roleId);

    // Remove duplicate user IDs
    const uniqueUserIds = Array.from(new Set(userIds));

    // Fetch users with the unique user IDs
    let users = await this.userTable.find({
      where: {
        id: In(uniqueUserIds),
      },
    });

    const hardcodeAdmins = JSON.parse(process.env.SUPER_ADMINS || '[]');
    if ((role = PredefinedRoles.SuperAdminRole)) {
      const hardcodedAdminUsers = await this.userTable.find({
        where: {
          username: In(hardcodeAdmins),
        },
      });
      users = users.concat(hardcodedAdminUsers);
    }

    users = users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.username === user.username),
    );

    return users;
  }

  async getAllPredefinedRoles(userId: number): Promise<string[]> {
    const returnResult: string[] = [];
    const predefinedRoles = Object.values(PredefinedRoles);
    const result = await this.aclTable.find({
      where: {
        model: In(predefinedRoles),
        // principalType: 'User',
        // principalId: userId.toString(),
      },
    });
    result.forEach((item) => {
      // console.log(item);
      returnResult.push(item.model);
    });
    return returnResult;
  }

  async assignPredefinedRole(
    userId: number,
    role: PredefinedRoles,
  ): Promise<void> {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      // principalType: 'User',
      // principalId: userId.toString(),
    });

    // await this.aclTable.create({
    //   model: role,
    //   principalType: 'User',
    //   principalId: userId.toString(),
    //   accessType: Action.Manage,
    //   permission: 'can',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async deletePredefinedRole(
    userId: number,
    role: PredefinedRoles,
  ): Promise<void> {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      // principalType: 'User',
      // principalId: userId.toString(),
    });
  }

  async denyPredefinedRole(
    userId: number,
    role: PredefinedRoles,
  ): Promise<void> {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      // principalType: 'User',
      // principalId: userId.toString(),
    });

    // await this.aclTable.create({
    //   model: role,
    //   principalType: 'User',
    //   principalId: userId.toString(),
    //   accessType: Action.Manage,
    //   permission: 'cannot',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async permitAccessToUser(
    accessType: Action,
    on: string,
    to: number,
  ): Promise<void> {
    await this.aclTable.deleteAll({
      model: on,
      // accessType: accessType,
      // principalType: 'User',
      // principalId: to.toString(),
    });
    // await this.aclTable.create({
    //   model: on,
    //   accessType: accessType,
    //   principalType: 'User',
    //   principalId: to.toString(),
    //   permission: 'can',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async denyAccessFromUser(
    accessType: Action,
    on: string,
    from: number,
  ): Promise<void> {
    await this.aclTable.deleteAll({
      model: on,
      // accessType: accessType,
      // principalType: 'User',
      // principalId: from.toString(),
    });
    // await this.aclTable.create({
    //   model: on,
    //   accessType: accessType,
    //   principalType: 'User',
    //   principalId: from.toString(),
    //   permission: 'cannot',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async deleteAccessForUser(
    accessType: Action,
    on: string,
    userId: number,
  ): Promise<void> {
    await this.aclTable.deleteAll({
      model: on,
      // accessType: accessType,
      // principalType: 'User',
      // principalId: userId.toString(),
    });
  }

  async permitAccess(accessType: Action, on: string): Promise<void> {
    await this.aclTable.deleteAll({
      model: on,
      // accessType: accessType,
      // principalType: '',
      // principalId: '',
    });

    // await this.aclTable.create({
    //   model: on,
    //   accessType: accessType,
    //   principalType: '',
    //   principalId: '',
    //   permission: 'can',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async denyAccess(accessType: Action, on: string): Promise<void> {
    await this.aclTable.deleteAll({
      model: on,
      // accessType: accessType,
      // principalType: '',
      // principalId: '',
    });

    // await this.aclTable.create({
    //   model: on,
    //   accessType: accessType,
    //   principalType: '',
    //   principalId: '',
    //   permission: 'cannot',
    //   hookType: HookTypeEnum.Before,
    // });
  }

  async getAllAcls(
    page = 1,
    pageSize = 10,
    search: string,
  ): Promise<GetAllAclsDto> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let where: any = {};
    if (search) {
      where = {
        or: [
          { model: { contains: search } },
          { accessType: { contains: search } },
          { principalType: { contains: search } },
          { principalId: { contains: search } },
          { permission: { contains: search } },
        ],
      };
    }

    const acls = await this.aclTable.find({
      where,
      skip,
      take,
    });

    const totalItems = await this.aclTable.count({
      where: where,
    });

    return {
      data: acls,
      page,
      pageSize,
      totalItems,
    };
  }
}
