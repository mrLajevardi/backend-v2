import { Injectable } from '@nestjs/common';
import { VUsers } from 'src/infrastructure/database/entities/views/v-users';
import { BaseTableService } from 'src/infrastructure/service/base-table';

@Injectable()
export class VusersTableService extends BaseTableService<VUsers, any, any>(
  VUsers,
) {}
