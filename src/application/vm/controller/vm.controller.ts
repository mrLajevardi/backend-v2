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
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { Raw } from 'typeorm';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { VmService } from '../service/vm.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { CreateVmFromTemplate } from '../dto/create-vm-from-template.dto';

@ApiTags('VM')
@Controller('vm')
@UseFilters(new HttpExceptionFilter())
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
    @Body() data: CreateVmFromTemplate,
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
    return this.vmService.deleteMedia(options, serviceInstanceId, mediaId);
  }

  @Delete('/:serviceInstanceId/:vmId/template')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deleteTemplate(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.deleteTemplate(options, serviceInstanceId, vmId);
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
    return this.vmService.getVmGeneralSection(options, serviceInstanceId, vmId);
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
    return this.vmService.suspendVm(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:transferId/transferFile')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'transferId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async transferFile(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('transferId') transferId: string,
    @Headers('content-length') contentLength,
    @Request() options,
  ): Promise<any> {
    return this.vmService.transferFile(
      options,
      serviceInstanceId,
      transferId,
      contentLength,
    );
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
  async undeployVm(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('vmId') vmId: string,
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<any> {
    return this.vmService.uploadFileInfo(options, data, serviceInstanceId);
  }
}
