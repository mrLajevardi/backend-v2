import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateServiceService } from '../services/create-service.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { DeleteServiceService } from '../services/delete-service.service';
import { ServiceService } from '../services/service.service';
import { CreateGroupsDto } from '../../crud/groups-table/dto/create-groups.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { GetServicesReturnDto } from '../dto/return/get-services.dto';
import { Discounts } from 'src/infrastructure/database/entities/Discounts';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { GetInvoiceReturnDto } from '../dto/return/get-invoice.dto';
import { GetServicePlansReturnDto } from '../dto/return/get-service-plans.dto';
@ApiTags('Services')
@Controller('services')
@ApiBearerAuth() // Requires authentication with a JWT token
export class ServiceController {
  constructor(
    private readonly service: ServiceService,
    private readonly createService: CreateServiceService,
    private readonly deleteService: DeleteServiceService,
    private readonly serviceService: ServiceService,
  ) {}

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return this.createService.createService(options, dto);
  }

  // create new item
  @ApiOperation({ summary: 'Deletes a service' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted',
  })
  @Delete('/:serviceInstanceId')
  async delete(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return this.deleteService.deleteService(options, serviceInstanceId);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiQuery({ name: 'id', required: false })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @Get()
  async getServices(
    @Request() options: SessionRequest,
    @Query('id') id?: string,
  ): Promise<GetServicesReturnDto[]> {
    return this.serviceService.getServices(options, id);
    // await this.invoicesTable.create(dto);
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @Post(':serviceInstanceId/repair')
  async repair(
    @Param('serviceInstanceId')
    serviceInstanceId: string,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return this.createService.repairService(options, serviceInstanceId);
  }

  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully updated ',
  })
  @Put('/:serviceInstanceId')
  async updateServiceInfo(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: CreateGroupsDto,
  ): Promise<void> {
    return this.createService.updateServiceInfo(serviceInstanceId, data);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @ApiQuery({ name: 'filter' })
  @Get('/discounts')
  async getDiscounts(@Query('filter') filter: string): Promise<Discounts[]> {
    return this.createService.getDiscounts(filter);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @ApiQuery({ name: 'filter' })
  @Get('/itemTypes')
  async getItemTypes(@Query('filter') filter: string): Promise<ItemTypes[]> {
    return this.createService.getItemTypes(filter);
  }

  @Get('/invioce/:invoiceId')
  @ApiOperation({ summary: 'Get service invoice' })
  @ApiResponse({
    status: 200,
    description: 'Invoice information',
    type: Object,
  }) // Adjust the type as needed
  @ApiParam({ name: 'invoiceId', type: String, description: 'Invoice ID' })
  async getInvoice(
    @Req() options: SessionRequest,
    @Param('invoiceId') invoiceId: number,
  ): Promise<GetInvoiceReturnDto> {
    return await this.service.getInvoice(options, invoiceId);
  }

  @Get('servicePlans')
  @ApiOperation({ summary: 'Returns service plans' })
  @ApiResponse({
    status: 200,
    description: 'Array of service plans',
    type: Array,
  }) // Adjust the type as needed
  async getServicePlans(): Promise<GetServicePlansReturnDto> {
    return await this.service.getServicePlans();
  }

  @Get('/verifyAuthority/:authorityCode')
  @ApiOperation({ summary: 'Verify Zarinpal Authority code' })
  @ApiResponse({
    status: 200,
    description: 'Verification result',
    type: Object,
  }) // Adjust the type as needed
  @ApiParam({
    name: 'authorityCode',
    type: String,
    description: 'Zarinpal Authority code',
  })
  async verifyZarinpalAuthority(
    @Req() options: SessionRequest,
    @Param('authorityCode') authorityCode: string,
  ): Promise<any> {
    return this.service.verifyZarinpalAuthority(options, authorityCode);
  }

  @Get('/zarinpalAuthority/:invoiceId')
  @ApiOperation({ summary: 'Get Zarinpal Authority code' })
  @ApiResponse({
    status: 200,
    description: 'Zarinpal Authority URL',
    type: String,
  }) // Adjust the type as needed
  @ApiParam({ name: 'invoiceId', type: String, description: 'Invoice ID' })
  async getZarinpalAuthority(
    @Req() options: SessionRequest,
    @Param('invoiceId') invoiceId: number,
  ): Promise<string> {
    return await this.service.getZarinpalAuthority(options, invoiceId);
  }

  @Get('serviceTypes')
  @ApiOperation({ summary: 'Get all serviceTypes' })
  @ApiResponse({
    status: 200,
    description: 'Array of serviceTypes',
    type: Array,
  }) // Adjust the type as needed
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    description: 'Filter string',
  })
  async getServiceTypes(
    @Req() options: SessionRequest,
    @Query('filter') filter: string,
  ): Promise<any> {
    return this.service.getServicetypes(options, filter);
  }
}
