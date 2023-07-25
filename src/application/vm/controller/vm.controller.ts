import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseFilters,
  Delete,
  Headers,
  Body
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
@Controller('VM')
@UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VmController {
  constructor(private readonly vmService: VmService) { }

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

  @Post('/:serviceInstanceId/:containerId/createTemplate')
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
    return this.vmService.createTemplate(options, serviceInstanceId, containerId, data);
  }

  @Post('/:serviceInstanceId/createVMFromTemplate')
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
    return this.vmService.createVMFromTemplate(options, data, serviceInstanceId);
  }

  @Post('/:serviceInstanceId/createVm')
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

  @Post('/:serviceInstanceId/:vmId/createVmSnapShot')
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
    return this.vmService.createVmSnapShot(options, serviceInstanceId, vmId, data);
  }

  @Delete('/:serviceInstanceId/:vmId/deleteMedia')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async deleteMedia(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.deleteMedia(options, serviceInstanceId, vmId);
  }

  @Delete('/:serviceInstanceId/:vmId/deleteTemplate')
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

  @Delete('/:serviceInstanceId/:vmId/deleteVm')
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
    @Body() data: CreateVmFromTemplate,
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
    @Body() data: CreateVmFromTemplate,
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
    @Body() data: CreateVmFromTemplate,
    @Request() options,
  ): Promise<any> {
    return this.vmService.ejectMedia(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/getAllUserVm')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'filter', type: String })
  @ApiQuery({ name: 'search', type: String })
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
    return this.vmService.getAllUserVm(options, serviceInstanceId, filter, search);
  }

  @Get('/:serviceInstanceId/getAllUserVmTemplates')
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

  @Get('/:serviceInstanceId/getCatalogMedias')
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
    return this.vmService.getCatalogMedias(options, serviceInstanceId, page, pageSize);
  }

  @Get('/:serviceInstanceId/getVmDiskSection')
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

  @Get('/:serviceInstanceId/:vmId/getVmGeneralSection')
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

  @Get('/:serviceInstanceId/getMedia')
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

  @Get('/:serviceInstanceId/getOsInfo')
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

  @Get('/:serviceInstanceId/:vmId/getQuestion')
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

  @Get('/:serviceInstanceId/getSupportedHardDiskAdaptors')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'osType' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async getSupportedHardDiskAdaptors(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('osType') osType: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.getSupportedHardDiskAdaptors(options, serviceInstanceId, osType);
  }

  @Get('/:serviceInstanceId/:templateId/getVAppTemplate')
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

  @Get('/:serviceInstanceId/:vmId/getVmComputeSection')
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

  @Get('/:serviceInstanceId/:vmId/getVmGuestCustomization')
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
    return this.vmService.getVmGuestCustomization(options, serviceInstanceId, vmId);
  }

  @Get('/:serviceInstanceId/:vmId/getVmNetworkSection')
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
  @ApiQuery({ name: 'page', type: String })
  @ApiQuery({ name: 'pageSize', type: String })
  @ApiQuery({ name: 'type', type: String })
  @ApiQuery({ name: 'sortDesc', type: String })
  @ApiQuery({ name: 'sortAsc', type: String })
  @ApiQuery({ name: 'format', type: String })
  @ApiQuery({ name: 'fields', type: String })
  @ApiQuery({ name: 'offset', type: String })
  @ApiQuery({ name: 'link', type: String })
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
      options, serviceInstanceId,
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

  @Post('/:serviceInstanceId/:vmId/removeVmSnapShot')
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
    return this.vmService.transferFile(options, serviceInstanceId, transferId, contentLength);
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

  @Post('/:serviceInstanceId/:vmId/updateVmComputeSection')
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
    return this.vmService.updateVmComputeSection(options, serviceInstanceId, vmId, data);
  }

  @Post('/:serviceInstanceId/:vmId/updateDiskSection')
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
    return this.vmService.updateDiskSection(options, data, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/updateGuestCustomization')
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
    return this.vmService.updateGuestCustomization(options, data, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:mediaId/updateMedia')
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
    return this.vmService.updateMedia(options, data, serviceInstanceId, mediaId);
  }

  @Post('/:serviceInstanceId/:templateId/updateVAppTemplate')
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
    return this.vmService.updateVAppTemplate(options, data, serviceInstanceId, templateId);
  }

  @Post('/:serviceInstanceId/:vmId/updateVmGeneralSection')
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
    return this.vmService.updateVmGeneralSection(options, data, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:vmId/updateVmNetworkSection')
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
    return this.vmService.updateVmNetworkSection(options, data, serviceInstanceId, vmId);
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
