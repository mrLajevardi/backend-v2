import { Injectable } from '@nestjs/common';
import { GroupsTableService } from '../crud/groups-table/groups-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { CreateGroupsDto } from '../crud/groups-table/dto/create-groups.dto';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class GroupService {
    constructor(
        private readonly groupTable : GroupsTableService,
        private readonly logger : LoggerService
    ){}


    async logCreateGroup(name: string, id: number , userId : number ) {
        await this.logger.info(
            'groups',
            'createGroup',
            {
              groupName: name,
              _object: id ,
            },
            {
              userId: userId,
            },
        );
    };


     async logDeleteGroup(id, userId) {
        await logger.info(
            'groups',
            'deleteGroup',
            {
              _object: id,
            },
            {
              userId: userId,
            },
        );
      };

      async getGroups(options, page, pageSize, name, description, color) {
        let skip = 0;
        let limit = 10;
        if (!isEmpty(page)) {
          skip = pageSize * ( page - 1 );
        }
        const where = isNil(name || description || color) ?
        {} :
        {
            name: name ? {like: `%${name}%`}: undefined,
            description: description ? {like: `%${description}%`} : undefined,
            color: color ? {like: `%${color}%`}: undefined,
        };
        if (!isEmpty(pageSize)) {
          limit = pageSize;
        }
        const groups = await this.groupTable.find({
          where,
          limit: pageSize,
          skip,
        });
        const countAll = await this.groupTable.count(where);
        return Promise.resolve({
          total: countAll,
          page,
          pageSize,
          record: groups,
        });
      };

      
      module.exports.afterUpdateGroup = async function(ctx, output, next) {
        await logger.info(
            'groups',
            'updateGroup',
            {
              groupName: output.Name,
              _object: output.ID,
            },
            {
              ...ctx.res.locals,
            },
        );
      };

      


}
