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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VmService } from '../service/vm.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { CreateVmFromTemplate } from '../dto/create-vm-from-template.dto';
import { CreateVm } from '../dto/create-vm.dto';
import { SnapShotDetails } from '../dto/snap-shot-details.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { VmList } from '../dto/get-all-user-vm.dto';
import { VmTemplateList } from '../dto/templates.dto';
import { VmDiskSection } from '../dto/disk-section.dto';
import { VmTicket } from '../dto/vm-ticket.dto';
import { CatalogMedia } from '../dto/catalog-media.dto';
import { VmGeneralSection } from '../dto/vm-general-section.dto';
import { HardwareInfo } from '../dto/hardware-info.dto';
import { VmMedia } from '../dto/get-media.dto';
import { VmOsInfo } from '../dto/os-info.dto';
import { VmRemovableMedia } from '../dto/vm-removableMedia.dto';
import {
  VmComputeSection,
  VmGuestCustomization,
  VmQuery,
  VmSupportedHardDiskAdaptors,
} from '../dto/vm.dto';
import { ExceedEnoughDiskCountException } from '../exceptions/exceed-enough-disk-count.exception';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { TransferFileHeaderDto } from '../dto/transfer-file.dto';
import { UploadFileDto } from '../dto/upload-file-info.dto';
import { RequestHeaders } from 'src/infrastructure/decorators/request-header-decorator';
import { DiskBusUnitBusNumberSpace } from '../../../wrappers/mainWrapper/user/vm/diskBusUnitBusNumberSpace';
import { PureAbility, subject } from '@casl/ability';
import { CheckPolicies } from 'src/application/base/security/ability/decorators/check-policies.decorator';
import { PolicyHandlerOptions } from 'src/application/base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from 'src/application/base/security/ability/enum/acl-subjects.enum';
import { Action } from 'src/application/base/security/ability/enum/action.enum';
import { TemplateNetworkSection } from '../dto/template-network-section.dto';

@ApiTags('VM')
@Controller('vm')
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Vm, props)),
// )
// @UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post('/:serviceInstanceId/:vmId/acquireVMTicket')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'any',
  })
  async acquireVMTicket(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<VmTicket> {
    return this.vmService.acquireVMTicket(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:containerId/template')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'containerId', description: 'container id of a vm' })
  @ApiResponse({
    status: 201,
    description: 'create template from vm',
    type: 'any',
  })
  async createTemplate(
    @Param('containerId') containerId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
    @Body() data: CreateTemplateDto,
  ): Promise<TaskReturnDto> {
    return this.vmService.createTemplate(
      options,
      serviceInstanceId,
      containerId,
      data,
    );
  }

  @Post('/:serviceInstanceId/fromTemplate')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async createVMFromTemplate(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
    @Body() data: CreateVmFromTemplate,
  ): Promise<TaskReturnDto> {
    return this.vmService.createVMFromTemplate(
      options,
      data,
      serviceInstanceId,
    );
  }

  @Post('/:serviceInstanceId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'create a vm from template',
    type: 'object',
  })
  async createVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
    @Body() data: CreateVm,
  ): Promise<TaskReturnDto> {
    return this.vmService.createVm(options, data, serviceInstanceId);
  }

  @Post('/:serviceInstanceId/:vmId/snapShot')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async createVmSnapShot(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.createVmSnapShot(
      options,
      serviceInstanceId,
      vmId,
      data,
    );
  }

  @Delete('/:serviceInstanceId/media/:mediaId')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'mediaId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deleteMedia(
    @Param('mediaId') mediaId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.deleteMedia(options, serviceInstanceId, mediaId);
  }

  @Delete('/:serviceInstanceId/:containerId/template')
  @ApiOperation({ summary: '' })
  @ApiParam({
    name: 'serviceInstanceId',
    description: 'VDC instance ID',
    example: '053CCE96-37B8-EE11-A56D-005056A89991',
  })
  @ApiParam({
    name: 'containerId',
    description: 'container value in templates list',
    example: 'vappTemplate-c8adf900-e590-4226-b380-70bdd814f781',
  })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deleteTemplate(
    @Param('containerId') containerId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.deleteTemplate(
      options,
      serviceInstanceId,
      containerId,
    );
  }

  @Delete('/:serviceInstanceId/:vmId/')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deleteVm(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.deleteVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/deployVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deployVm(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.deployVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/discardSuspendVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async discardSuspendVm(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.discardSuspendVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/ejectMedia')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async ejectMedia(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.ejectMedia(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId')
  @ApiOperation({ summary: 'get all user vms' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getAllUserVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Request() options,
  ): Promise<VmList> {
    return this.vmService.getAllUserVm(
      options,
      serviceInstanceId,
      filter,
      search,
    );
  }

  @Get('/:serviceInstanceId/templates')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 200,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getAllUserVmTemplates(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<VmTemplateList[]> {
    return this.vmService.getAllUserVmTemplates(options, serviceInstanceId);
  }

  @Get('/:serviceInstanceId/catalog/mediaFiles')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getCatalogMedias(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Request() options,
  ): Promise<CatalogMedia> {
    return this.vmService.getCatalogMedias(
      options,
      serviceInstanceId,
      page,
      pageSize,
    );
  }

  @Get('/:serviceInstanceId/:vmId/diskSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmDiskSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<VmDiskSection[]> {
    return this.vmService.getVmDiskSection(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/:vmId/generalSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmGeneralSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<VmGeneralSection> {
    return this.vmService.getVmGeneralSection(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/:vmId/snapshotDetails')
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getSnapShotDetails(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<SnapShotDetails> {
    return this.vmService.getSnapShotDetails(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/getHardwareInfo')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 200,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getHardwareInfo(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<HardwareInfo[]> {
    return this.vmService.getHardwareInfo(options, serviceInstanceId);
  }

  @Get('/:serviceInstanceId/media')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 200,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getMedia(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<VmMedia[]> {
    return this.vmService.getMedia(options, serviceInstanceId);
  }

  @Get('/:serviceInstanceId/osInfo')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 200,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getOsInfo(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<VmOsInfo> {
    return this.vmService.getOsInfo(options, serviceInstanceId);
  }

  @Get('/:serviceInstanceId/:vmId/question')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getQuestion(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getQuestion(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/:vmId/getVmRemovableMedia')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmRemovableMedia(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<VmRemovableMedia[]> {
    return this.vmService.getVmRemovableMedia(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/supportedHardDiskAdaptors')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'osType', required: false })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getSupportedHardDiskAdaptors(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('osType') osType: string | undefined,
    @Request() options,
  ): Promise<VmSupportedHardDiskAdaptors[]> {
    return this.vmService.getSupportedHardDiskAdaptors(
      options,
      serviceInstanceId,
      osType || null,
    );
  }

  @Get('/:serviceInstanceId/:templateId/vAppTemplate')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'templateId', description: 'template id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVAppTemplate(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('templateId') templeId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getVAppTemplate(options, serviceInstanceId, templeId);
  }

  @Get('/:serviceInstanceId/:templateId/vAppTemplate/networkSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'templateId', description: 'template id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: [TemplateNetworkSection],
  })
  async getVAppTemplateNetworkSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('templateId') templeId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getNetworksVappTemplate(
      options,
      serviceInstanceId,
      templeId,
    );
  }

  @Get('/:serviceInstanceId/:vmId/computeSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmComputeSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<VmComputeSection> {
    return this.vmService.getVmComputeSection(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/:vmId/guestCustomization')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmGuestCustomization(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<VmGuestCustomization> {
    return this.vmService.getVmGuestCustomization(
      options,
      serviceInstanceId,
      vmId,
    );
  }

  @Get('/:serviceInstanceId/:vmId/networkSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getVmNetworkSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getVmNetworkSection(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/insertMedia')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async insertMedia(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.insertMedia(options, serviceInstanceId, vmId, data);
  }

  @Post('/:serviceInstanceId/:vmId/installVmTools')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async installVmTools(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.installVmTools(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/postAnswer')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async postAnswer(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<void> {
    return this.vmService.postAnswer(options, serviceInstanceId, vmId, data);
  }

  @Post('/:serviceInstanceId/:vmId/powerOnVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async powerOnVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.powerOnVm(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/query')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'pageSize', type: String, required: false })
  @ApiQuery({ name: 'type', type: String, required: false })
  @ApiQuery({ name: 'sortDesc', type: String, required: false })
  @ApiQuery({ name: 'sortAsc', type: String, required: false })
  @ApiQuery({ name: 'format', type: String, required: false })
  @ApiQuery({ name: 'fields', type: String, required: false })
  @ApiQuery({ name: 'offset', type: String, required: false })
  @ApiQuery({ name: 'link', type: String, required: false })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async query(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('pageSize') type: string,
    @Query('pageSize') sortDesc: string,
    @Query('pageSize') sortAsc: string,
    @Query('pageSize') filter: string,
    @Query('pageSize') format: string,
    @Query('pageSize') fields: string,
    @Query('pageSize') offset: string,
    @Query('pageSize') link: string,
    @Request() options,
  ): Promise<VmQuery> {
    return this.vmService.query(
      options,
      serviceInstanceId,
      page,
      pageSize,
      filter,
      type,
      sortDesc,
      sortAsc,
      format,
      fields,
      offset,
      link,
    );
  }

  @Post('/:serviceInstanceId/:vmId/rebootVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async rebootVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.rebootVm(options, serviceInstanceId, vmId);
  }

  @Delete('/:serviceInstanceId/:vmId/snapShot')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async removeVmSnapShot(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.removeVmSnapShot(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/resetVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async resetVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.resetVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/revertVmSnapShot')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async revertVmSnapShot(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.revertVmSnapShot(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/suspendVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async suspendVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.suspendVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:transferId/transferFile')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'transferId', description: 'vm id' })
  async transferFile(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('transferId') transferId: string,
    @RequestHeaders() headers: TransferFileHeaderDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    return this.vmService.transferFile(
      options,
      serviceInstanceId,
      transferId,
      headers['content-length'],
    );
  }

  @Post('/:serviceInstanceId/:vmId/undeploy')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async undeployVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.undeployVm(options, serviceInstanceId, vmId, data);
  }

  @Put('/:serviceInstanceId/:vmId/computeSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateVmComputeSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.updateVmComputeSection(
      options,
      serviceInstanceId,
      vmId,
      data,
    );
  }

  @Put('/:serviceInstanceId/:vmId/diskSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateDiskSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<ExceedEnoughDiskCountException | TaskReturnDto> {
    return this.vmService.updateDiskSection(
      options,
      data,
      serviceInstanceId,
      vmId,
    );
  }

  @Put('/:serviceInstanceId/:vmId/guestCustomization')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateGuestCustomization(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.updateGuestCustomization(
      options,
      data,
      serviceInstanceId,
      vmId,
    );
  }

  @Put('/:serviceInstanceId/media/:mediaId/')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'mediaId', description: 'media id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateMedia(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('mediaId') mediaId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    console.log('first');
    return this.vmService.updateMedia(
      options,
      data,
      serviceInstanceId,
      mediaId,
    );
  }

  @Put('/:serviceInstanceId/:templateId/vAppTemplate')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'templateId', description: 'template id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateVAppTemplate(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('templateId') templateId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.updateVAppTemplate(
      options,
      data,
      serviceInstanceId,
      templateId,
    );
  }

  @Put('/:serviceInstanceId/:vmId/generalSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateVmGeneralSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.updateVmGeneralSection(
      options,
      data,
      serviceInstanceId,
      vmId,
    );
  }

  @Put('/:serviceInstanceId/:vmId/networkSection')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async updateVmNetworkSection(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<TaskReturnDto> {
    return this.vmService.updateVmNetworkSection(
      options,
      data,
      serviceInstanceId,
      vmId,
    );
  }

  @Post('/:serviceInstanceId/uploadFileInfo')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async uploadFileInfo(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: UploadFileDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return this.vmService.uploadFileInfo(options, data, serviceInstanceId);
  }

  @Get('/:serviceInstanceId/:templateId/templateAdaptors')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'templateId', description: 'templateId of adaptors' })
  @ApiResponse({
    status: 201,
    description: 'supported adaptors of a template',
    type: 'object',
  })
  async getTemplateAdaptors(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('templateId') templateId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getTemplateAdaptors(
      options,
      serviceInstanceId,
      templateId,
    );
  }
  @Get('/disk/getDiskBusTypeInfo/')
  diskBusTypeInfo() {
    return DiskBusUnitBusNumberSpace;
  }
}
