import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiQuery,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServiceAdminService } from '../services/service-admin.service';
import { Configs } from 'src/infrastructure/database/entities/Configs';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { VdcResourceLimitsDto } from '../dto/vdc-resource-limits.dto';
import { UpdateItemTypesDto } from '../../crud/item-types-table/dto/update-item-types.dto';
import { ServiceReports } from 'src/infrastructure/database/entities/views/service-reports';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { PoliciesGuard } from '../../security/ability/guards/policies.guard';
import { PredefinedRoles } from '../../security/ability/enum/predefined-enum.type';
import { Roles } from '../../security/ability/decorators/roles.decorator';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { PaginationReturnDto } from 'src/infrastructure/dto/pagination-return.dto';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { ItemTypeWithConsumption } from '../types/item-type-with-consumption.type';
import { UpdateConfigsDto } from '../../crud/configs-table/dto/update-configs.dto';

@ApiTags('Services-admin')
@Controller('admin/services')
@ApiBearerAuth() // Requires authentication with a JWT token
@UseGuards(PoliciesGuard)
@Roles(PredefinedRoles.AdminRole)
export class ServiceAdminController {
  constructor(private readonly service: ServiceAdminService) {}

  @Delete(':serviceInstanceId')
  @ApiOperation({ summary: 'Delete service by Admin' })
  @ApiParam({
    name: 'serviceInstanceId',
    type: 'string',
    description: 'Service instance ID',
  })
  @ApiOkResponse({ description: 'The deleted service data' })
  async adminDeleteService(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.service.deleteService(options, serviceInstanceId);
    return {
      message: `Service with ID ${serviceInstanceId} deleted successfully`,
    };
  }

  @Post(':serviceInstanceId/disable')
  @ApiOperation({ summary: 'Disable service by admin' })
  @ApiParam({
    name: 'serviceInstanceId',
    type: 'string',
    description: 'Service instance ID',
  })
  @ApiOkResponse({ description: 'The disabled service data' })
  async adminDisableService(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.service.disableService(options, serviceInstanceId);
    return {
      message: `Service with ID ${serviceInstanceId} disabled successfully`,
    };
  }

  @Post(':serviceInstanceId/enable')
  @ApiOperation({ summary: 'Enable service by admin' })
  @ApiParam({
    name: 'serviceInstanceId',
    type: 'string',
    description: 'Service instance ID',
  })
  @ApiOkResponse({ description: 'The enabled service data' })
  async adminEnableService(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.service.enableService(options, serviceInstanceId);
    return {
      message: `Service with ID ${serviceInstanceId} enabled successfully`,
    };
  }

  @Get('configs')
  @ApiOperation({ summary: 'Return service configs for admin' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'serviceTypeId', type: String, required: false })
  @ApiQuery({ name: 'key', type: String, required: false })
  @ApiQuery({ name: 'value', type: String, required: false })
  @ApiOkResponse({
    description: 'The array of service configurations',
    type: [Configs],
  })
  async adminGetConfigurations(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('key') key?: string,
    @Query('value') value?: string,
  ): Promise<PaginationReturnDto<Configs>> {
    return await this.service.getConfigs(
      options,
      page,
      pageSize,
      serviceTypeId,
      key,
      value,
    );
  }

  @Get('itemTypes')
  @ApiOperation({ summary: 'Return service item types for admin' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'serviceTypeID', type: String, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'unit', type: String, required: false })
  @ApiQuery({ name: 'fee', type: Number, required: false })
  @ApiQuery({ name: 'code', type: String, required: false })
  @ApiQuery({ name: 'maxAvailable', type: Number, required: false })
  @ApiQuery({ name: 'maxPerRequest', type: Number, required: false })
  @ApiQuery({ name: 'minPerRequest', type: Number, required: false })
  @ApiOkResponse({
    description: 'The array of service item types',
    type: [ItemTypes],
  })
  async adminGetItemTypes(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('serviceTypeID') serviceTypeID?: string,
    @Query('title') title?: string,
    @Query('unit') unit?: string,
    @Query('fee') fee?: number,
    @Query('code') code?: string,
    @Query('maxAvailable') maxAvailable?: number,
    @Query('maxPerRequest') maxPerRequest?: number,
    @Query('minPerRequest') minPerRequest?: number,
  ): Promise<PaginationReturnDto<ItemTypeWithConsumption>> {
    return await this.service.getItemTypes(
      options,
      page,
      pageSize,
      serviceTypeID,
      title,
      unit,
      fee,
      code,
      maxAvailable,
      maxPerRequest,
      minPerRequest,
    );
  }

  @Get('reports')
  @ApiOperation({ summary: 'Return reports of services' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'serviceTypeId', type: String, required: false })
  @ApiQuery({ name: 'serviceName', type: String, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'family', type: String, required: false })
  @ApiQuery({ name: 'orgName', type: String, required: false })
  @ApiOkResponse({
    description: 'The array of service reports',
    type: [ServiceReports],
  })
  async adminGetReports(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('serviceName') serviceName?: string,
    @Query('name') name?: string,
    @Query('family') family?: string,
    @Query('orgName') orgName?: string,
  ): Promise<PaginationReturnDto<ServiceReports>> {
    return await this.service.getReports(
      options,
      page,
      pageSize,
      serviceTypeId,
      serviceName,
      name,
      family,
      orgName,
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Return service count for admin' })
  @ApiOkResponse({ description: 'The service count data', type: Object })
  async adminGetServiceCount(): Promise<object> {
    return await this.service.getServiceCount();
  }

  @Get(':serviceInstanceId/invoices')
  @ApiOperation({ summary: 'Return invoices of services' })
  @ApiParam({
    name: 'serviceInstanceId',
    type: 'string',
    description: 'Service instance ID',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'finalAmount', type: Number, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'description', type: String, required: false })
  @ApiQuery({ name: 'id', type: Number, required: false })
  @ApiQuery({ name: 'payed', type: Boolean, required: false })
  @ApiOkResponse({ description: 'The array of invoices', type: [Invoices] })
  async adminGetServiceInvoices(
    @Req() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('finalAmount') finalAmount?: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('id') id?: number,
    @Query('payed') payed?: boolean,
  ): Promise<{ invoices: Invoices[]; total: number }> {
    return await this.service.getServiceInvoices(
      options,
      serviceInstanceId,
      page,
      pageSize,
      finalAmount,
      name,
      description,
      id,
      payed,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all services by Admin' })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'pageSize', type: String, required: false })
  @ApiQuery({ name: 'serviceTypeId', type: String, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'unit', type: String, required: false })
  @ApiQuery({ name: 'fee', type: String, required: false })
  @ApiQuery({ name: 'code', type: String, required: false })
  @ApiQuery({ name: 'maxAvailable', type: String, required: false })
  @ApiQuery({ name: 'maxPerRequest', type: String, required: false })
  @ApiQuery({ name: 'minPerRequest', type: String, required: false })
  @ApiOkResponse({ description: 'The object containing services' })
  async adminGetServices(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('title') filter?: string,
  ): Promise<{ services: ServiceInstances[]; countAll: number }> {
    console.log('get service');
    return await this.service.getService(page, pageSize, filter);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'serviceType', type: String, required: false })
  @ApiQuery({ name: 'userID', type: String, required: false })
  @ApiQuery({ name: 'value', type: String, required: false })
  @ApiQuery({ name: 'invoiceID', type: String, required: false })
  @ApiQuery({ name: 'ServiceID', type: String, required: false })
  @ApiQuery({ name: 'startDateTime', type: String, required: false })
  @ApiQuery({ name: 'endDateTime', type: String, required: false })
  @ApiOkResponse({ description: 'The array of user transactions', type: Array })
  async getTransactions(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('serviceType') serviceType?: string,
    @Query('userID') userID?: number,
    @Query('value') value?: number,
    @Query('invoiceID') invoiceID?: number,
    @Query('ServiceID') ServiceID?: string,
    @Query('startDateTime') startDateTime?: string,
    @Query('endDateTime') endDateTime?: string,
  ): Promise<{ transaction: Transactions[]; totalRecords: number }> {
    return await this.service.getTransactions(
      page,
      pageSize,
      serviceType,
      userID,
      value,
      invoiceID,
      ServiceID,
      startDateTime ? new Date(startDateTime) : null,
      endDateTime ? new Date(endDateTime) : null,
    );
  }

  @Put('configs/:configId')
  @ApiOperation({ summary: 'Modifies service configs' })
  @ApiParam({
    name: 'configId',
    type: 'string',
    description: 'Configuration ID',
  })
  @ApiBody({
    type: Object,
    description: 'Data to update the service configuration',
  })
  async adminUpdateConfigurations(
    @Param('configId') configId: number,
    @Body() data: UpdateConfigsDto,
  ): Promise<void> {
    await this.service.updateConfigs(configId, data);
  }

  @Patch('itemTypes/:serviceItemTypeId')
  @ApiOperation({ summary: 'Update service item types for admin' })
  @ApiParam({
    name: 'serviceItemTypeId',
    type: 'string',
    description: 'Service item type ID',
  })
  @ApiBody({
    type: UpdateItemTypesDto,
    description: 'Updated data for the service item type',
  })
  async adminUpdateItemTypes(
    @Req() options: SessionRequest,
    @Param('serviceItemTypeId') serviceItemTypeId: number,
    @Body() data: UpdateItemTypesDto,
  ): Promise<void> {
    await this.service.updateItemTypes(options, serviceItemTypeId, data);
  }

  @Patch('resourceLimits/:serviceTypeId')
  @ApiOperation({ summary: 'Update service resource limits for admin' })
  @ApiParam({
    name: 'serviceTypeId',
    type: 'string',
    description: 'Service type ID',
  })
  @ApiBody({
    type: VdcResourceLimitsDto,
    description: 'Updated data for the resource limits',
  })
  async adminUpdateVdcResourceLimits(
    @Req() options: SessionRequest,
    @Param('serviceTypeId') serviceTypeId: string,
    @Body() data: VdcResourceLimitsDto,
  ): Promise<void> {
    await this.service.updateServiceResourceLimits(
      options,
      serviceTypeId,
      data,
    );
  }
}
