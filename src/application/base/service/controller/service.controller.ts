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

@ApiTags('Services')
@Controller('services')
@ApiBearerAuth() // Requires authentication with a JWT token
export class ServiceController {
  constructor(
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
    @Request() options: any,
  ): Promise<any> {
    return this.createService.createService(options, dto);
    // await this.invoicesTable.create(dto);
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
    @Request() options: any,
  ): Promise<any> {
    return this.deleteService.deleteService(options, serviceInstanceId);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @Get()
  async getServices(@Request() options: any): Promise<any> {
    return this.serviceService.getServices(options);
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
    @Request() options: any,
  ): Promise<any> {
    return this.createService.repairService(options, serviceInstanceId);
  }

  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted',
  })
  @Put('/:serviceInstanceId')
  async updateServiceInfo(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: CreateGroupsDto,
    @Request() options: any,
  ): Promise<any> {
    return this.createService.updateServiceInfo(serviceInstanceId, data);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @ApiQuery({name: 'filter'})
  @Get('/discounts')
  async getDiscounts(@Query('filter') filter: string): Promise<any> {
    return this.createService.getDiscounts(filter);
  }

  // create new item
  @ApiOperation({ summary: 'get services of a user' })
  @ApiResponse({
    status: 200,
    description: 'user services have been fetched successfully',
  })
  @ApiQuery({name: 'filter'})
  @Get('/itemTypes')
  async getItemTypes(@Query('filter') filter: string): Promise<any> {
    return this.createService.getItemTypes(filter);
  }
}
