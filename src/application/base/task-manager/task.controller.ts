import { Get, Controller } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Taskss')
@ApiBearerAuth()
@Controller('taskss')
export class TaskController {
  constructor(private readonly taskManager: TaskManagerService) {}
  @Get()
  async getTask() {
    console.log('first')
    // await this.taskManager.addTask({});
    return;
  }
}
