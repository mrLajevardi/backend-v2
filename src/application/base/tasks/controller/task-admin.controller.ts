import { Controller, Get, Param } from '@nestjs/common';
import { TaskAdminService } from '../service/task-admin.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SingleTaskDTO } from '../dto/single-task.dto';
import { PredefinedRoles } from '../../security/ability/enum/predefined-enum.type';
import { Roles } from '../../security/ability/decorators/roles.decorator';
import { GetTasksReturnDto } from '../dto/return/get-tasks-return.dto';

@Controller('/tasks/admin')
@ApiBearerAuth()
@ApiTags('Task-admin')
@Roles(PredefinedRoles.AdminRole)
export class TaskAdminController {
  constructor(private readonly service: TaskAdminService) {}

  @ApiOperation({ summary: 'Return a specific task' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'taskId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: SingleTaskDTO,
  })
  @Get(':vdcInstanceId/userTask/:taskId')
  async getTask(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('taskId') taskId: string,
  ): Promise<{ task: GetTasksReturnDto }> {
    console.log('get  a task');
    const task = await this.service.getTask(vdcInstanceId, taskId);
    return { task };
  }

  @ApiOperation({ summary: 'Return a list of user tasks' })
  @ApiParam({ name: 'serviceInstanceId', type: 'string' })
  @Get(':serviceInstanceId/userTask')
  async getTasksList(
    @Param('serviceInstanceId') serviceInstanceId: string,
  ): Promise<{ tasksList: GetTasksReturnDto[] }> {
    console.log('get tasks');
    const tasksList = await this.service.getTasksList(serviceInstanceId);
    return { tasksList };
  }
}
