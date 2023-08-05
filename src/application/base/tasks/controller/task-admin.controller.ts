import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TaskAdminService } from '../service/task-admin.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SingleTaskDTO } from '../dto/single-task.dto';
import { TaskDataDTO } from '../dto/task-data.dto';
import { Action } from '../../security/ability/enum/action.enum';
import { PredefinedRoles } from '../../security/ability/enum/predefined-enum.type';
import { PureAbility } from '@casl/ability';
import { CheckPolicies } from '../../security/ability/decorators/check-policies.decorator';
import { PoliciesGuard } from '../../security/ability/guards/policies.guard';

@Controller('/tasks/admin')
@ApiBearerAuth()
@ApiTags('Task-admin')
@UseGuards(PoliciesGuard)
@CheckPolicies((ability: PureAbility) => ability.can(Action.Manage  , PredefinedRoles.AdminRole ))
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
    @Req() options: object,
  ): Promise<any> {
    console.log('get  a task');
    const task = await this.service.getTask(vdcInstanceId, taskId);
    return { task };
  }

  @ApiOperation({ summary: 'Return a list of user tasks' })
  @ApiParam({ name: 'serviceInstanceId', type: 'string' })
  @Get(':serviceInstanceId/userTask')
  async getTasksList(
    @Param('serviceInstanceId') serviceInstanceId: string,
  ): Promise<any> {
    console.log('get tasks');
    const tasksList = await this.service.getTasksList(serviceInstanceId);
    return { tasksList };
  }
}
