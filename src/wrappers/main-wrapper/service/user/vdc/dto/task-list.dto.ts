import { TasksStatusEnum } from 'src/application/base/tasks/enum/tasks-status.enum';

export interface TasksListDto {
  record: Records;
}

interface Records {
  status: TasksStatusEnum;
}
