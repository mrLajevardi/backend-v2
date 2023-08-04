import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from '../service/tasks.service';

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
    @Request() options: any,
    @Param('vdcInstanceId') vdcInstanceId: string,
  ) {
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
    @Request() options: any,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('taskId') taskId: string,
  ) {
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
    @Request() options: any,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.cancelTask(options, vdcInstanceId, taskId);
  }
}
