import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { VdcService } from '../service/vdc.service';
import { CreateNamedDiskDto } from '../dto/create-named-disk.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { ExtendedOptionsDto } from 'src/infrastructure/dto/extended-options.dto';
import { updateNamedDiskDto } from '../dto/update-named-disk.dto';
import { NamedDiskDto } from '../dto/named-disk.dto';
import { VdcAdditionalInfoDto } from '../dto/vdc-additional-info.dto';
@ApiBearerAuth()
@ApiTags('Vpc')
@Controller('vdc')
export class VdcController {
  constructor(private readonly vdcService: VdcService) {}

  @Post('/:serviceInstanceId/namedDisk/:namedDiskId/attach/:vmId')
  @ApiOperation({ summary: 'Attach Named Disk to VM' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'Task ID of Operation',
    type: TaskReturnDto,
  })
  async attachNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Param('vmId')
    vmId: string,
  ): Promise<TaskReturnDto> {
    return this.vdcService.attachNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      vmId,
    );
  }

  @Post('/:serviceInstanceId/namedDisk')
  @ApiOperation({ summary: 'Creates a Named Disk' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'Task ID of Named Disk creation process',
    type: TaskReturnDto,
  })
  async createNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Body()
    data: CreateNamedDiskDto,
  ): Promise<TaskReturnDto> {
    return this.vdcService.createNamedDisk(options, vdcInstanceId, data);
  }

  @Post('/:serviceInstanceId/namedDisk/:namedDiskId/detach/:vmId')
  @ApiOperation({ summary: 'Detach Named Disk from VM' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: `named disk's id` })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'Task ID of Operation',
    type: TaskReturnDto,
  })
  async detachNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Param('vmId')
    vmId: string,
  ): Promise<TaskReturnDto> {
    return this.vdcService.detachNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      vmId,
    );
  }

  @Get('/:serviceInstanceId/namedDisk')
  @ApiOperation({ summary: 'Returns a list of Named Disks' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'List of Named Disks',
    type: [NamedDiskDto],
  })
  async getNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<NamedDiskDto[]> {
    return this.vdcService.getNamedDisk(options, serviceInstanceId);
  }

  @Get('/:serviceInstanceId')
  @ApiOperation({ summary: 'Returns Additional info of vpc service' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'vpc additional info',
    type: VdcAdditionalInfoDto,
  })
  async getVdc(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
  ): Promise<VdcAdditionalInfoDto> {
    return this.vdcService.getVdc(options, vdcInstanceId);
  }

  @Get('/:serviceInstanceId/namedDisk/:namedDiskId/attachedVm')
  @ApiOperation({ summary: 'returns Attached VM ID to Named Disk' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'Attached VM ID',
    type: 'string',
  })
  async getVmAttachedToNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ): Promise<null | string> {
    return this.vdcService.getVmAttachedToNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
    );
  }

  @Delete('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: 'Deletes a Named Disk by given ID' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: `Named Disk update process's Task ID`,
    type: TaskReturnDto,
  })
  async removeNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ): Promise<TaskReturnDto> {
    return this.vdcService.removeNamedDisk(options, vdcInstanceId, namedDiskId);
  }

  @Put('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: 'Updates a Named Disk with given id' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'Named Disk ID' })
  @ApiResponse({
    status: 201,
    description: `Named Disk update process's Task ID`,
    type: TaskReturnDto,
  })
  async updateNamedDisk(
    @Request()
    options: ExtendedOptionsDto,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Body()
    data: updateNamedDiskDto,
  ): Promise<TaskReturnDto> {
    return this.vdcService.updateNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      data,
    );
  }
}
