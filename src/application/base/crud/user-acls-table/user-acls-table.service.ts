import { Injectable } from '@nestjs/common';
import { UserAcls } from 'src/infrastructure/database/entities/views/user-acls';
import { BaseTableService } from 'src/infrastructure/service/base-table';

@Injectable()
export class UserAclsTableService extends BaseTableService<UserAcls, any, any>(
  UserAcls,
) {}
