import { Controller, Get, Post, Param, Request, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from '../service/tasks.service';
import { GetTasksReturnDto } from '../dto/return/get-tasks-return.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { SortDateTypeEnum } from '../../../../infrastructure/filters/sort-date-type.enum';
import { CheckPolicies } from '../../../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../../../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../../../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../../../base/security/ability/enum/action.enum';

@ApiTags('Tasks')
@Controller('/tasks')
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Tasks, props)),
)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiQuery({
    name: 'dateFilter',
    type: String,
    // enum: SortDateTypeEnum,
    required: false,
    // allowEmptyValue:true
  })
  @ApiQuery({
    name: 'serviceInstanceId',
    type: String,
    required: false,
    example: 'D7F09556-272D-47CE-A91D-8FBA51676BF4',
  })
  @ApiQuery({ name: 'vmId', type: String, required: false })
  @ApiQuery({ name: 'vappId', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({
    name: 'dateBegin',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'dateEnd',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @Get()
  async getTasks(
    @Query('dateFilter') dateFilter: SortDateTypeEnum,
    @Query('serviceInstanceId') serviceInstanceId: string,
    @Query('vmId') vmId: string,
    @Query('vappId') vappId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('dateBegin') dateBegin: Date,
    @Query('dateEnd') dateEnd: Date,
    @Request() options: SessionRequest,
  ): Promise<GetTasksReturnDto[]> {
    return this.tasksService.getTasksList(options, {
      dateBegin: dateBegin,
      dateFilter: dateFilter,
      dateEnd: dateEnd,
      pageSize: pageSize ? pageSize : 1,
      vmId: vmId,
      serviceInstanceId: serviceInstanceId,
      page: page ? page : 10,
      vappId: vappId,
    });
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiParam({ name: 'taskId' })
  @Get(':taskId')
  async getTask(
    @Request() options: SessionRequest,
    @Param('taskId') taskId: string,
  ): Promise<GetTasksReturnDto> {
    return this.tasksService.getTask(options, taskId);
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiParam({ name: 'vdcInstanceId' })
  @ApiParam({ name: 'taskId' })
  @Post(':vdcInstanceId/:taskId/cancel')
  async cancelTask(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    return this.tasksService.cancelTask(options, vdcInstanceId, taskId);
  }

  @ApiOperation({
    summary: 'Retry a Task',
  })
  @ApiParam({ name: 'taskId', type: String })
  @ApiResponse({
    status: 201,
  })
  async retryCustomTasks(
    @Request() options: SessionRequest,
    @Param() taskId: string,
  ): Promise<void> {
    return this.tasksService.retryCustomTasks(options, taskId);
  }
}
