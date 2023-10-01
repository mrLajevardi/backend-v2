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
import { TempDto } from '../dto/temp.dto';
import { vpcDetailsMock } from '../mock/vpc-details.mock';
import { vpcInternalSettingsMock } from '../mock/vpc-internal-settings.mock';
import { vpcTemplatesMock } from '../mock/vpc-templates.mock';
@ApiBearerAuth()
@ApiTags('Vpc')
// @UseFilters(new HttpExceptionFilter())
@Controller('vdc')
export class VdcController {
  constructor(
    // private readonly tasksService: TasksService,
    private readonly vdcService: VdcService,
  ) {}

  @Post('/:serviceInstanceId/namedDisk/:namedDiskId/attach/:vmId')
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
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
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
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Body()
    data: TempDto,
  ) {
    return this.vdcService.createNamedDisk(options, vdcInstanceId, data);
  }

  @Post('/:serviceInstanceId/namedDisk/:namedDiskId/detach/:vmId')
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
    @Param('serviceInstanceId')
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
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ) {
    return this.vdcService.getNamedDisk(options, serviceInstanceId);
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
    @Param('serviceInstanceId')
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
    @Param('serviceInstanceId')
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
    @Param('serviceInstanceId')
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
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Body()
    data: TempDto,
  ) {
    return this.vdcService.updateNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
      data,
    );
  }

  @Get('invoice/:invoiceId/details')
  @ApiOperation({ summary: 'get created invoice details' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  async getVdcInvoiceDetail(
    @Param('invoiceId')
    invoiceId: string,
  ) {
    return {
      datacenter: { name: 'amin', title: 'امین' },
      cpu: { price: 1000, title: '', unit: 'Core', quantity: 10 },
      vm: { price: 1000, title: '', unit: 'Server', quantity: 5 },
      ram: { price: 1000, title: '', unit: 'GB', quantity: 10 },
      disk: [
        {
          price: 25000,
          title: 'archive',
          unit: 'GB',
          quantity: 10,
        },
        { price: 20000, title: 'standard', unit: 'GB', quantity: 20 },
      ],
      guaranty: 'VIP',
      period: 150,
      ip: { price: 20000, title: '', unit: 'IP', quantity: 14 },
      generation: 'G2',
      finalPrice: 10000,
      reservationRam: 25,
      reservationCpu: 25,
    };
  }

  @Get(':serviceInstanceId/details')
  @ApiOperation({
    summary: 'get details of vdc',
    description: 'servicePlanTypes: \n0: static, 1: pay as you go',
  })
  @ApiParam({
    type: String,
    name: 'serviceInstanceId',
  })
  async getVdcDetails(
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<typeof vpcDetailsMock> {
    return vpcDetailsMock;
  }

  @Get(':serviceInstanceId/internalSettings')
  @ApiOperation({
    summary: 'get internal settings of vdc',
  })
  @ApiParam({
    type: String,
    name: 'serviceInstanceId',
  })
  async getVdcInternalSettings(
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<typeof vpcInternalSettingsMock> {
    return vpcInternalSettingsMock;
  }

  @Get('templates')
  @ApiOperation({
    summary: 'get templates list',
  })
  @ApiParam({
    type: String,
    name: 'serviceInstanceId',
  })
  async getVdcTemplates(): Promise<typeof vpcTemplatesMock> {
    return vpcTemplatesMock;
  }
}
