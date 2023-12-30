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
import {
  GetNetworkListDto,
  GetNetworkListQueryDto,
} from './dto/get-network-list.dto';
import { UpdateDhcpDto } from '../edge-gateway/dto/update-dbcp.dto';
import { TempDto } from '../vdc/dto/temp.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { DhcpService } from './dhcp.service';
import { CheckPolicies } from '../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../base/security/ability/enum/action.enum';

@ApiTags('Networks')
@ApiBearerAuth()
@Controller('networks')
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Networks, props)),
)
export class NetworksController {
  constructor(
    private readonly service: NetworksService,
    private readonly dhcpService: DhcpService,
  ) {}

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
    @Body() data: TempDto,
  ): Promise<object> {
    return await this.dhcpService.createDhcpBinding(
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
    type: TaskReturnDto,
  })
  async createNetwork(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: NetworkDto,
  ): Promise<TaskReturnDto> {
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
    return await this.dhcpService.deleteDhcpBinding(
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
    return await this.dhcpService.deleteDhcp(options, vdcInstanceId, networkId);
  }

  @Delete(':serviceInstanceId/:networkId')
  @ApiOperation({ summary: 'Delete a network' })
  @ApiParam({ name: 'serviceInstanceId', type: 'string' })
  @ApiParam({ name: 'networkId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted network',
    type: TaskReturnDto,
  })
  async deleteNetwork(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('networkId') networkId: string,
  ): Promise<TaskReturnDto> {
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
    return await this.dhcpService.getAllDhcpBindings(
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
    return this.dhcpService.getDhcpBinding(
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
    return this.dhcpService.getDhcp(options, vdcInstanceId, networkId);
  }

  @Get(':vdcInstanceId')
  @ApiOperation({
    summary: 'Get a list of networks',
    description:
      'Status property represents status of a Org Vdc network. This value will be PENDING if the network has been recorded by VCD but has not been fully configured, CONFIGURING if the network is in transition, REALIZED if the existing state of the network has been fully realized, or REALIZED_FAILED if there was an error creating the network.',
  })
  @ApiParam({ name: 'vdcInstanceId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of networks',
    type: GetNetworkListDto,
  })
  async getNetworks(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Query() query: GetNetworkListQueryDto,
  ): Promise<GetNetworkListDto> {
    return this.service.getNetworks(options, vdcInstanceId, query);
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
    @Body() data: TempDto,
  ): Promise<object> {
    return this.dhcpService.updateDhcpBinding(
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
    @Body() data: TempDto,
  ): Promise<object> {
    return await this.dhcpService.updateDhcp(
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
    type: TaskReturnDto,
  })
  async updateNetwork(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('networkId') networkId: string,
    @Body() data: NetworkDto,
  ): Promise<TaskReturnDto> {
    return await this.service.updateNetwork(
      data,
      options,
      serviceInstanceId,
      networkId,
    );
  }
}
