import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { CreateServiceService } from 'src/application/base/service/services/create-service.service';
import { ServiceService } from 'src/application/base/service/services/service.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseFilters,
  Delete,
  Put,
  Headers,
  Body,
} from '@nestjs/common';
import { VdcService } from '../service/vdc.service';
import { CreateGroupsDto } from 'src/application/base/crud/groups-table/dto/create-groups.dto';
@ApiBearerAuth()
@ApiTags('Vpc')
@UseFilters(new HttpExceptionFilter())
@Controller('vdc')
export class VdcController {
  constructor(
    // private readonly tasksService: TasksService,
    private readonly vdcService: VdcService,
  ) {}

  @Post('/:serviceInstanceId/namedDisk/:namedDisk/attach/:vmId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async attachNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Param('vdcInstanceId')
    namedDiskId: string,
    @Param('vmId')
    vmId: string,
  ) {
    return this.vdcService.attachNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      vmId,
    );
  }

  @Post('/:serviceInstanceId/namedDisk')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async createNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Body()
    data: CreateGroupsDto,
  ) {
    return this.vdcService.createNamedDisk(options, vdcInstanceId, data);
  }

  @Post('/:serviceInstanceId/namedDisk/:namedDisk/detach/:vmId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async detachNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Param('vmId')
    vmId: string,
  ) {
    return this.vdcService.detachNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      vmId,
    );
  }

  @Get('/:serviceInstanceId/namedDisk')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async getNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
  ) {
    return this.vdcService.getNamedDisk(options, vdcInstanceId);
  }

  @Get('/:serviceInstanceId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async getVdc(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
  ) {
    return this.vdcService.getVdc(options, vdcInstanceId);
  }

  @Get('/:serviceInstanceId/namedDisk/:namedDiskId/attachedVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async getVmAttachedToNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ) {
    return this.vdcService.getVmAttachedToNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
    );
  }

  @Delete('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async removeNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ) {
    return this.vdcService.removeNamedDisk(options, vdcInstanceId, namedDiskId);
  }

  @Put('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async updateNamedDisk(
    @Request()
    options: any,
    @Param('vdcInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Body()
    data: CreateGroupsDto,
  ) {
    return this.vdcService.updateNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      data,
    );
  }
}
