import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { VdcService } from '../service/vdc.service';
import { TempDto } from '../dto/temp.dto';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { vpcInternalSettingsMock } from '../mock/vpc-internal-settings.mock';
import { vpcTemplatesMock } from '../mock/vpc-templates.mock';
import {
  BASE_VDC_INVOICE_SERVICE,
  BaseVdcInvoiceServiceInterface,
} from '../interface/service/base-vdc-invoice-service.interface';
import {
  BASE_VDC_DETAIL_SERVICE,
  BaseVdcDetailService,
} from '../interface/service/base-vdc-detail-service.interface';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';
import { TemplatesTableService } from 'src/application/base/crud/templates/templates-table.service';
import { Public } from 'src/application/base/security/auth/decorators/ispublic.decorator';
import { TemplatesDto, templatesQueryParamsDto } from '../dto/templates.dto';
// import { Public } from 'src/application/base/security/auth/decorators/ispublic.decorator';

@ApiBearerAuth()
@ApiTags('Vpc')
// @UseFilters(new HttpExceptionFilter())
@Controller('vdc')
export class VdcController {
  constructor(
    @Inject(BASE_VDC_INVOICE_SERVICE)
    private readonly baseVdcInvoiceService: BaseVdcInvoiceServiceInterface,
    @Inject(BASE_VDC_DETAIL_SERVICE)
    private readonly baseVdcDetailService: BaseVdcDetailService,

    private readonly r: TemplatesTableService,
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
  ): Promise<GetOrgVdcResult> {
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
  @ApiParam({ name: 'invoiceId', description: 'VDC instance ID' })
  async getVdcInvoiceDetail(
    @Param('invoiceId')
    invoiceId: string,
  ): Promise<VdcInvoiceDetailsResultDto> {
    return await this.baseVdcInvoiceService.getVdcInvoiceDetail(invoiceId);
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
    @Request()
    options: any,
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<VdcDetailsResultDto> {
    return this.baseVdcDetailService.getVdcDetail(serviceInstanceId, options);
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

  @ApiOperation({
    summary: 'get templates list',
  })
  @ApiResponse({ type: [TemplatesDto] })
  @ApiParam({ name: 'serviceInstanceId' })
  @Get(':serviceInstances/templates')
  @Public()
  async getVdcTemplates(
    @Query() templatesQueryDto: templatesQueryParamsDto,
  ): Promise<TemplatesDto[]> {
    return this.vdcService.getTemplates(templatesQueryDto);
  }
}
