import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
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
  UseGuards,
} from '@nestjs/common';
import { VdcService } from '../service/vdc.service';
import { TempDto } from '../dto/temp.dto';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
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
import { VdcDetailItemResultDto } from '../dto/vdc-detail-item.result.dto';
import { TemplatesTableService } from 'src/application/base/crud/templates/templates-table.service';
import { Public } from 'src/application/base/security/auth/decorators/ispublic.decorator';
import { TemplatesDto, templatesQueryParamsDto } from '../dto/templates.dto';
import { VdcItemLimitResultDto } from '../dto/vdc-Item-limit.result.dto';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { CreateNamedDiskDto } from '../dto/create-named-disk.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { NamedDiskDto } from '../dto/named-disk.dto';
import { UpdateNamedDiskDto } from '../dto/update-named-disk.dto';
import {
  DiskItemCodes,
  DiskItemName,
} from '../../base/itemType/enum/item-type-codes.enum';
import {
  GetAvailableResourcesDto,
  GetAvailableResourcesQueryDto,
} from '../dto/get-resources.dto';
import { PersonalVerificationGuard } from 'src/application/base/security/auth/guard/personal-verification.guard';
// import { Public } from 'src/application/base/security/auth/decorators/ispublic.decorator';

@ApiBearerAuth()
@ApiTags('Vpc')
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
    type: TaskReturnDto,
  })
  async createNamedDisk(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Body()
    data: CreateNamedDiskDto,
  ): Promise<TaskReturnDto> {
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
    type: TaskReturnDto,
  })
  async detachNamedDisk(
    @Request()
    options: SessionRequest,
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
  @ApiOperation({ summary: 'get all service named disks' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: [NamedDiskDto],
  })
  async getNamedDisk(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<NamedDiskDto[]> {
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
  @ApiOperation({ summary: 'get attached vm of a named disk' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: String,
  })
  async getVmAttachedToNamedDisk(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ): Promise<string> {
    return this.vdcService.getVmAttachedToNamedDisk(
      options,
      vdcInstanceId,
      namedDiskId,
    );
  }

  @Delete('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: 'remove named disk' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: TaskReturnDto,
  })
  async removeNamedDisk(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
  ): Promise<TaskReturnDto> {
    return this.vdcService.removeNamedDisk(options, vdcInstanceId, namedDiskId);
  }

  @Put('/:serviceInstanceId/namedDisk/:namedDiskId')
  @ApiOperation({ summary: 'update named Disk' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'namedDiskId', description: 'named disk id' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: TaskReturnDto,
  })
  async updateNamedDisk(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    vdcInstanceId: string,
    @Param('namedDiskId')
    namedDiskId: string,
    @Body()
    data: UpdateNamedDiskDto,
  ): Promise<TaskReturnDto> {
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
    return await this.baseVdcInvoiceService.getVdcInvoiceDetail(
      invoiceId,
      'vdc',
    );
  }

  @Get('invoice/:invoiceId/preFactor')
  @ApiOperation({ summary: 'get pre factor PDF' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  async getVdcPreFactor(
    @Param('invoiceId')
    invoiceId: string,
  ) {
    const res = await this.baseVdcInvoiceService.getVdcPreFactor(
      invoiceId,
      'vdc',
    );
    return res;
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
    @Request()
    options: any,
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<VdcDetailItemResultDto> {
    return await this.baseVdcDetailService.getVdcDetailItems(
      options,
      serviceInstanceId,
    );
    // return vpcInternalSettingsMock;
  }

  @ApiOperation({
    summary: 'get templates list',
  })
  @ApiResponse({ type: [TemplatesDto] })
  // @ApiParam({ name: 'serviceInstanceId' })
  @Get('serviceInstances/templates')
  @Public()
  async getVdcTemplates(
    @Query() templatesQueryDto: templatesQueryParamsDto,
  ): Promise<TemplatesDto[]> {
    return this.vdcService.getTemplates(templatesQueryDto);
  }

  @Get(':serviceInstanceId/limitItems')
  // @Public()
  @ApiParam({
    type: String,
    name: 'serviceInstanceId',
  })
  async getVdcItemLimit(
    @Request()
    options: SessionRequest,
    @Param('serviceInstanceId')
    serviceInstanceId: string,
  ): Promise<VdcItemLimitResultDto> {
    return this.baseVdcDetailService.getVdcItemLimit(
      serviceInstanceId,
      options,
    );
  }

  @Get('/disk/diskTypes')
  async getDiskTypes(): Promise<any> {
    return [
      { code: DiskItemCodes.Standard, name: DiskItemName.Standard },
      { code: DiskItemCodes.Archive, name: DiskItemName.Archive },
      { code: DiskItemCodes.Fast, name: DiskItemName.Fast },
      { code: DiskItemCodes.Vip, name: DiskItemName.Vip },
    ];
  }

  @Get('resources/availableResources')
  @UseGuards(PersonalVerificationGuard)
  @ApiOperation({ summary: 'Returns available resources' })
  @ApiResponse({
    status: 200,
    description: 'available resources',
    type: GetAvailableResourcesDto,
  })
  async get(
    @Query() query: GetAvailableResourcesQueryDto,
  ): Promise<GetAvailableResourcesDto> {
    return await this.vdcService.getAvailableResources(query.datacenterName);
  }
}
