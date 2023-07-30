import { Injectable } from '@nestjs/common';
import { GroupsTableService } from '../crud/groups-table/groups-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isEmpty, isNil } from 'lodash';
import { FindOptionsWhere, Like } from 'typeorm';
import { Groups } from 'src/infrastructure/database/entities/Groups';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupTable: GroupsTableService,
    private readonly logger: LoggerService,
  ) {}

  async logCreateGroup(name: string, id: number, userId: number) {
    await this.logger.info(
      'groups',
      'createGroup',
      {
        groupName: name,
        _object: id.toString(),
      },
      {
        userId: userId.toString(),
      },
    );
  }

  async logDeleteGroup(id: number, userId: number) {
    await this.logger.info(
      'groups',
      'deleteGroup',
      {
        _object: id.toString(),
      },
      {
        userId: userId.toString(),
      },
    );
  }

  async getGroups(
    page: number,
    pageSize: number,
    name: string,
    description: string,
    color: string,
  ): Promise<any> {
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }

    const where: FindOptionsWhere<Groups> = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (description) {
      where.description = Like(`%${description}%`);
    }

    if (color) {
      where.color = Like(`%${color}%`);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }
    const groups = await this.groupTable.find({
      where,
      take: pageSize,
      skip,
    });
    const countAll = await this.groupTable.count({ where });
    return Promise.resolve({
      total: countAll,
      page,
      pageSize,
      record: groups,
    });
  }

  async logUpdateGroup(name: string, id: number, userId: number) {
    await this.logger.info(
      'groups',
      'updateGroup',
      {
        groupName: name,
        _object: id.toString(),
      },
      {
        userId: userId.toString(),
      },
    );
  }
}
