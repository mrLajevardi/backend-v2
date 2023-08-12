import { Controller, Get, Post, Param, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from '../service/tasks.service';
import { GetTasksReturnDto } from '../dto/return/get-tasks-return.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';

@ApiTags('Tasks')
@Controller('/tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiParam({ name: 'vdcInstanceId' })
  @Get(':vdcInstanceId')
  async getTasks(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
  ): Promise<GetTasksReturnDto[]> {
    return this.tasksService.getTasksList(options, vdcInstanceId);
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiParam({ name: 'vdcInstanceId' })
  @ApiParam({ name: 'taskId' })
  @Get(':vdcInstanceId/task/:taskId')
  async getTask(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('taskId') taskId: string,
  ): Promise<GetTasksReturnDto> {
    return this.tasksService.getTask(options, vdcInstanceId, taskId);
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
}
