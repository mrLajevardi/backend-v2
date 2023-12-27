import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
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
import { GetAllVdcServiceWithItemsResultDto } from '../dto/get-all-vdc-service-with-items-result.dto';
import { CreditIncrementDto } from '../../user/dto/credit-increment.dto';
import { PersonalVerificationGuard } from '../../security/auth/guard/personal-verification.guard';
import { PaygServiceService } from '../services/payg-service.service';
import { CreatePaygVdcServiceDto } from '../../invoice/dto/create-payg-vdc-service.dto';
import { ServiceTypesEnum } from '../enum/service-types.enum';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';

@ApiTags('Services')
@Controller('services')
@ApiBearerAuth() // Requires authentication with a JWT token
export class ServiceController {
  constructor(
    private readonly service: ServiceService,
    private readonly createService: CreateServiceService,
    private readonly deleteService: DeleteServiceService,
    private readonly serviceService: ServiceService,
    private readonly paygService: PaygServiceService,
  ) {}

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @UseGuards(PersonalVerificationGuard)
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
  @ApiQuery({
    name: 'serviceTypeId',
    required: false,
    description: ' vdc, aradAi, vgpu',
  })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @Get()
  async getServices(
    @Request() options: SessionRequest,
    @Query('serviceTypeId') typeId?: string,
    @Query('id') id?: string,
  ): Promise<GetServicesReturnDto[]> {
    return this.serviceService.getServices(options, typeId, id);
    // await this.invoicesTable.create(dto);
  }

  @ApiOperation({ summary: 'get services with Items for a user' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({
    name: 'serviceTypeId',
    required: false,
    description: ' vdc, aradAi, vgpu',
  })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @Get('withItems')
  async getServicesWithItems(
    @Request() options: SessionRequest,
    @Query('serviceTypeId') typeId?: string,
    @Query('id') id?: string,
  ): Promise<GetAllVdcServiceWithItemsResultDto[]> {
    return (await this.serviceService.getServicesWithItems(
      options,
      typeId,
      id,
    )) as GetAllVdcServiceWithItemsResultDto[];
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

  @ApiOperation({ summary: 'Update Service (Extendnig !!!!)' })
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

  @Post('/zarinpalAuthority/:invoiceId')
  @ApiOperation({ summary: 'Get Zarinpal Authority code' })
  @ApiResponse({
    status: 200,
    description: 'Zarinpal Authority URL',
    type: String,
  })
  @ApiParam({ name: 'invoiceId', type: String, description: 'Invoice ID' })
  async getZarinpalAuthority(
    @Req() options: SessionRequest,
    @Param('invoiceId') invoiceId: number,
    @Body() dto: CreditIncrementDto,
  ): Promise<string> {
    return await this.service.getZarinpalAuthority(options, invoiceId, dto);
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

  @Post('/vdc/payg')
  async createVdcPayg(
    @Body() dto: CreateServiceDto,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return this.paygService.createPaygVdcService(dto, options);
  }

  @Put('/vdc/payg/upgrade')
  async upgradeVdcPayg(
    @Body() dto: CreateServiceDto,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return this.paygService.upgradePayg(dto, options);
  }

  @Post('/vdc/payg/calculator')
  async vdcPaygCalculator(
    @Body() dto: CreatePaygVdcServiceDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return this.paygService.getPaygVdcCalculator(dto);
  }

  @Post('/payg/check')
  async paygCheck(): Promise<any> {
    return this.paygService.checkAllVdcVmsEvents();
  }

  @Get('/reports/:serviceType')
  @ApiQuery({
    name: 'ServiceType',
    type: String,
    required: true,
    description: 'ServiceType',
  })
  async reportService(): Promise<any> {
    return {
      unpaidInvoices: 8,
      activeTickets: 20,
      servicesExpiringCount: 15,
      servicesBudgetCount: 16,
    };
  }

  @ApiOperation({ summary: 'get templates' })
  @ApiQuery({
    name: 'serviceTypeId',
    required: true,
    type: String,
    description: ' vdc, ai',
  })
  @Get('/templates')
  async getTemplates(
    @Request() options: SessionRequest,
    @Query('serviceTypeId') serviceType: ServiceTypesEnum,
  ): Promise<any> {
    return this.serviceService.getTemplates(
      options,
      serviceType,
      ServicePlanTypeEnum.Static,
    );
  }
}
