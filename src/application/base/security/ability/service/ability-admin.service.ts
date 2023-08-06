import { Injectable } from "@nestjs/common";
import { ACLTableService } from "src/application/base/crud/acl-table/acl-table.service";
import { UserTableService } from "src/application/base/crud/user-table/user-table.service";
import { AbilitySubjects, getStringListOfAbilities } from "../ability.factory";
import { User } from "src/infrastructure/database/entities/User";
import { Action } from "../enum/action.enum";
import { PredefinedRoles } from "../enum/predefined-enum.type";
import { BadRequestError } from "passport-headerapikey";
import { BadRequestException } from "src/infrastructure/exceptions/bad-request.exception";
import { In } from "typeorm";
import { PredefinedRoleDto } from "../dto/predefined-role.dto";
import { stringToEnum } from "src/infrastructure/helpers/helpers";
import { dbEntities } from "src/infrastructure/database/entityImporter/orm-entities";

@Injectable()
export class AbilityAdminService {
  constructor(
    private readonly aclTable: ACLTableService,
    private readonly userTable: UserTableService
  ) {}

  getListOfModels() : string[] {
    return getStringListOfAbilities();
  }


  async getAllPredefinedRoles(userId: number): Promise<string[]> {
    const returnResult: string[] = [];
    const predefinedRoles = Object.values(PredefinedRoles);
    const result = await this.aclTable.find({
      where: {
        model: In(predefinedRoles),
        principalType: "User",
        principalId: userId.toString(),
      },
    });
    result.forEach((item) => {
      // console.log(item);
      returnResult.push(item.model);
    });
    return returnResult;
  }

  async assignPredefinedRole(userId: number, role: PredefinedRoles) {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: "User",
      principalId: userId.toString(),
    });

    await this.aclTable.create({
      model: role,
      principalType: "User",
      principalId: userId.toString(),
      accessType: Action.Manage,
      permission: "can",
    });
  }

  async deletePredefinedRole(userId: number, role: PredefinedRoles) {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: "User",
      principalId: userId.toString(),
    });
  }

  async denyPredefinedRole(userId: number, role: PredefinedRoles) {
    if (!role || !userId) {
      throw new BadRequestException();
    }

    await this.aclTable.deleteAll({
      model: role,
      principalType: "User",
      principalId: userId.toString(),
    });

    await this.aclTable.create({
      model: role,
      principalType: "User",
      principalId: userId.toString(),
      accessType: Action.Manage,
      permission: "cannot",
    });
  }

  async permitAccessToUser(accessType: Action, on: string, to: number) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: "User",
      principalId: to.toString(),
    });
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: "User",
      principalId: to.toString(),
      permission: "can",
    });
  }

  async denyAccessFromUser(accessType: Action, on: string, from: number) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: "User",
      principalId: from.toString(),
    });
    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: "User",
      principalId: from.toString(),
      permission: "cannot",
    });
  }

  async deleteAccessForUser(accessType: Action, on: string, userId: number) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: "User",
      principalId: userId.toString(),
    });
  }

  async permitAccess(accessType: Action, on: string) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: "",
      principalId: "",
    });

    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: "",
      principalId: "",
      permission: "can",
    });
  }

  async denyAccess(accessType: Action, on: string) {
    await this.aclTable.deleteAll({
      model: on,
      accessType: accessType,
      principalType: "",
      principalId: "",
    });

    await this.aclTable.create({
      model: on,
      accessType: accessType,
      principalType: "",
      principalId: "",
      permission: "cannot",
    });
  }

  async getAllAcls(page: number = 1, pageSize: number = 10, search: string) {
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
