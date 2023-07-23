import { Injectable } from '@nestjs/common';
import { UserTableService } from '../crud/user-table/user-table.service';
import { isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class UserAdminService {

    constructor(
        private readonly userTable: UserTableService,
        private readonly logger: LoggerService,
    ) { }

    async deleteUsers(options, userId) {
        const user = await this.userTable.findById(userId);
        if (isNil(user)) {
            return Promise.reject(new ForbiddenException());
        }
        await this.userTable.updateAll({ id: userId }, {
            deleted: true,
        });
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
    };

    
}
