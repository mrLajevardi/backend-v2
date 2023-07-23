import { Injectable } from '@nestjs/common';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';

@Injectable()
export class AbilityAdminService {

    constructor(
        private readonly aclTable : ACLTableService,
        private readonly userTable : UserTableService
    ){}

     
}
