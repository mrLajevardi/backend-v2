import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { NetworksService } from './networks.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DhcpBindingsDataDto } from './dto/dbcp-bindings.dto';
import { NetworkDto } from './dto/network.dto';
import { GetDhcpDto } from './dto/get-dhcp.dto';
import { GetNetworkListDto } from './dto/get-network-list.dto';
import { GetNetworksDto } from './dto/get-networks.dto';
import { UpdateDhcpDto } from '../edge-gateway/dto/update-dbcp.dto';

@ApiTags('Networks')
@ApiBearerAuth()
@Controller('networks')
export class NetworksController {
  constructor(private readonly service: NetworksService) {}

  @Post(':vdcInstanceId/:networkId/dhcp/bindings')
  @ApiOperation({ summary: 'Create a new dhcp binding' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiBody({ type: DhcpBindingsDataDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the created dhcp binding',
    type: Object,
  })
  async createDhcpBinding(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Body() data: DhcpBindingsDataDto,
  ): Promise<object> {
    return await this.service.dhcp.createDhcpBinding(
      options,
      vdcInstanceId,
      networkId,
      data,
    );
  }

  @Post(':vdcInstanceId')
  @ApiOperation({ summary: 'Create a network' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiBody({ type: NetworkDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the created network',
    type: Object,
  })
  async createNetwork(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: NetworkDto,
  ): Promise<object> {
    return await this.service.createNetwork(data, options, vdcInstanceId);
  }

  @Delete(':vdcInstanceId/:networkId/dhcp/bindings/:bindingId')
  @ApiOperation({ summary: 'Delete a dhcp binding' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiParam({ name: 'bindingId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted dhcp binding',
    type: Object,
  })
  async deleteDhcpBinding(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Param('bindingId') bindingId: string,
  ): Promise<object> {
    return await this.service.dhcp.deleteDhcpBinding(
      options,
      vdcInstanceId,
      networkId,
      bindingId,
    );
  }

  @Delete(':vdcInstanceId/:networkId/dhcp')
  @ApiOperation({ summary: 'Delete dhcp of a specific network' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted dhcp of the specific network',
    type: Object,
  })
  async deleteDhcp(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
  ): Promise<object> {
    return await this.service.dhcp.deleteDhcp(
      options,
      vdcInstanceId,
      networkId,
    );
  }

  @Delete(':serviceInstanceId/:networkId')
  @ApiOperation({ summary: 'Delete a network' })
  @ApiParam({ name: 'serviceInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted network',
    type: Object,
  })
  async deleteNetwork(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('networkId') networkId: string,
  ): Promise<object> {
    return await this.service.deleteNetwork(
      options,
      serviceInstanceId,
      networkId,
    );
  }

  @Get(':vdcInstanceId/:networkId/dhcp/bindings')
  @ApiOperation({ summary: 'Get all dhcp binding' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'getAll', type: 'boolean', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of dhcp bindings',
    type: [DhcpBindingsDataDto],
  })
  async getAllDhcpBindings(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Query('pageSize') pageSize?: number,
    @Query('getAll') getAll?: boolean,
  ): Promise<DhcpBindingsDataDto[]> {
    return await this.service.dhcp.getAllDhcpBindings(
      options,
      vdcInstanceId,
      networkId,
      pageSize,
      getAll,
    );
  }

  @Get(':vdcInstanceId/:networkId/dhcp/bindings/:bindingId')
  @ApiOperation({ summary: 'Get a dhcp binding' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiParam({ name: 'bindingId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the dhcp binding',
    type: DhcpBindingsDataDto,
  })
  async getDhcpBindingConfig(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Param('bindingId') bindingId: string,
  ): Promise<DhcpBindingsDataDto> {
    return this.service.dhcp.getDhcpBinding(
      options,
      vdcInstanceId,
      networkId,
      bindingId,
    );
  }

  @Get(':vdcInstanceId/:networkId/dhcp')
  @ApiOperation({ summary: 'Get dhcp of a specific network' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the dhcp of the specific network',
    type: GetDhcpDto,
  })
  async getDhcp(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
  ): Promise<GetDhcpDto> {
    return this.service.dhcp.getDhcp(options, vdcInstanceId, networkId);
  }

  @Get(':vdcInstanceId')
  @ApiOperation({ summary: 'Get a list of networks' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'filter', type: 'string', required: false })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of networks',
    type: GetNetworksDto,
  })
  async getNetworks(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('filter') filter?: string,
    @Query('search') search?: string,
  ): Promise<GetNetworkListDto> {
    return this.service.getNetworks(
      options,
      vdcInstanceId,
      page,
      pageSize,
      filter,
      search,
    );
  }

  @Put(':vdcInstanceId/:networkId/dhcp/bindings/:bindingId')
  @ApiOperation({ summary: 'Update dhcp binding' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiParam({ name: 'bindingId', type: 'string' })
  @ApiBody({ type: DhcpBindingsDataDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated dhcp binding',
    type: Object,
  })
  async updateDhcpBinding(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Param('bindingId') bindingId: string,
    @Body() data: DhcpBindingsDataDto,
  ): Promise<object> {
    return this.service.dhcp.updateDhcpBinding(
      options,
      vdcInstanceId,
      networkId,
      bindingId,
      data,
    );
  }

  @Put(':vdcInstanceId/:networkId/dhcp')
  @ApiOperation({ summary: 'Update and create dhcp service of a network' })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiBody({ type: UpdateDhcpDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated or created dhcp service',
    type: Object,
  })
  async updateDhcp(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('networkId') networkId: string,
    @Body() data: UpdateDhcpDto,
  ): Promise<object> {
    return await this.service.dhcp.updateDhcp(
      options,
      vdcInstanceId,
      networkId,
      data,
    );
  }

  @Put(':serviceInstanceId/:networkId')
  @ApiOperation({ summary: 'Update a network' })
  @ApiParam({ name: 'serviceInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiBody({ type: NetworkDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated network',
    type: Object,
  })
  async updateNetwork(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('networkId') networkId: string,
    @Body() data: NetworkDto,
  ): Promise<object> {
    return await this.service.updateNetwork(
      data,
      options,
      serviceInstanceId,
      networkId,
    );
  }
}
