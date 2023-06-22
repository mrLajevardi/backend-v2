import { Injectable } from '@nestjs/common';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskTable: TasksTableService
  ) {}

  

}
