import { Injectable } from '@nestjs/common';
import { BaseTableService } from 'src/infrastructure/service/base-table';
import { VReportsUser } from '../../../../infrastructure/database/entities/views/v-reports-user';

@Injectable()
export class VReportsUserTableService extends BaseTableService<
  VReportsUser,
  any,
  any
>(VReportsUser) {}
