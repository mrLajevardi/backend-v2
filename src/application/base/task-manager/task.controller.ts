import { Get, Controller } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Taskss')
@Controller('taskss')
@ApiBearerAuth()
@Controller()
export class TaskController {
  constructor(private readonly taskManager: TaskManagerService) {}
  @Get()
  async getTask() {
    await this.taskManager.addTask({});
    return;
  }
}
