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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateApplicationPortProfileDto } from '../dto/create-application-port-profile.dto';
import { IPSetDto, UpdateIpSetsDto } from '../dto/ip-set.dto';
import { ApplicationProfileListDto } from '../dto/application-profile-list.dto';
import { DnsDto } from '../dto/dns.dto';
import { IpSetsDto } from '../dto/ip-sets.dto';
import { DhcpForwarderDto } from '../../networks/dto/dhcp-forwarder.dto';
import { UpdateFirewallDto } from '../dto/update-firewall.dto';
import { EdgeGatewayService } from '../service/edge-gateway.service';
import { SingleApplicationPortProfileDto } from '../dto/single-application-port-profile.dto';
import { FirewallListDto } from '../dto/firewall-list.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { GetIpSetsListQueryDto } from '../dto/ip-set-list.dto';
import { FirewallListItemDto } from '../dto/firewall-list-item.dto';

@ApiTags('Edge Gateway')
@Controller('edge-gateway')
@ApiBearerAuth()
export class EdgeGatewayController {
  constructor(private readonly service: EdgeGatewayService) {}
  @Post('/:vdcInstanceId/firewalls')
  @ApiOperation({ summary: 'Create a single firewall rule' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async addToFirewallList(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: FirewallListItemDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return await this.service.firewall.addToFirewallList(
      options,
      vdcInstanceId,
      data,
    );
  }

  @Post('/:vdcInstanceId/applicationPortProfiles')
  @ApiOperation({ summary: 'Create an applicationPortProfile' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async createApplicationPortProfile(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: CreateApplicationPortProfileDto,
    @Request() options,
  ): Promise<any> {
    return await this.service.applicationPortProfile.createApplicationPortProfile(
      options,
      vdcInstanceId,
      data,
    );
  }

  @Post('/:vdcInstanceId/ipSets')
  @ApiOperation({ summary: 'Create an IP Set' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: TaskReturnDto })
  async createIPSet(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: IPSetDto,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return await this.service.createIPSet(options, vdcInstanceId, data);
  }

  @Delete('/:vdcInstanceId/applicationPortProfiles/:applicationId')
  @ApiOperation({ summary: 'Delete an applicationPortProfile' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  async deleteApplicationPortProfile(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('applicationId') applicationId: string,
    @Request() options,
  ): Promise<any> {
    return await this.service.applicationPortProfile.deleteApplicationPortProfile(
      options,
      vdcInstanceId,
      applicationId,
    );
  }

  @Delete('/:vdcInstanceId/firewalls/:firewallId')
  @ApiOperation({ summary: 'Delete a firewall' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'firewallId', description: 'Firewall ID' })
  async deleteFirewall(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('firewallId') firewallId: string,
    @Request() options,
  ): Promise<any> {
    return await this.service.firewall.deleteFirewall(
      options,
      vdcInstanceId,
      firewallId,
    );
  }

  @Delete('/:vdcInstanceId/ipSets/:ipSetId')
  @ApiOperation({ summary: 'Delete an IP Set' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSetId', description: 'IP Set ID' })
  @ApiResponse({ type: TaskReturnDto })
  async deleteIPSet(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSetId') ipSetId: string,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return await this.service.deleteIPSet(options, vdcInstanceId, ipSetId);
  }

  @Get('/:vdcInstanceId/applicationPortProfiles/:applicationId')
  @ApiOperation({ summary: 'Get an applicationPortProfile by ID' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  async getApplicationPortProfile(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('applicationId') applicationId: string,
    @Request() options,
  ): Promise<SingleApplicationPortProfileDto> {
    return await this.service.applicationPortProfile.getApplicationPortProfile(
      options,
      vdcInstanceId,
      applicationId,
    );
  }

  @Get('/:vdcInstanceId/applicationPortProfiles')
  @ApiOperation({ summary: 'Get a list of applicationPortProfiles' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'filter', type: 'string', required: false })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  async getApplicationPortProfiles(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('filter') filter?: string,
    @Query('search') search?: string,
  ): Promise<ApplicationProfileListDto> {
    return await this.service.applicationPortProfile.getApplicationPortProfiles(
      options,
      vdcInstanceId,
      page,
      pageSize,
      filter,
      search,
    );
  }

  @Get('/:vdcInstanceId/DhcpForwarder')
  @ApiOperation({
    summary: 'Get DHCP Forwarder configuration of an edge gateway',
  })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async getDhcpForwarder(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
  ): Promise<DhcpForwarderDto> {
    return await this.service.getDhcpForwarder(options, vdcInstanceId);
  }

  @Get('/:vdcInstanceId/DNS')
  @ApiOperation({ summary: 'Get a list of DNS forwarders' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async getDnsForwarder(
    @Request() options,
    @Param('vdcInstanceId') vdcInstanceId: string,
  ): Promise<DnsDto> {
    return await this.service.getDnsForwarder(options, vdcInstanceId);
  }

  @Get('/:vdcInstanceId/ExternalIPs')
  @ApiOperation({ summary: 'Get a list of dedicated IPs' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async getExternalIPs(
    @Request() options,

    @Param('vdcInstanceId') vdcInstanceId: string,
  ): Promise<string[]> {
    return await this.service.getExternalIPs(options, vdcInstanceId);
  }

  @Get('/:vdcInstanceId/firewalls')
  @ApiOperation({ summary: 'Get a list of firewalls' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: FirewallListDto })
  async getFirewallList(
    @Request() options: SessionRequest,

    @Param('vdcInstanceId') vdcInstanceId: string,
  ): Promise<FirewallListDto> {
    return await this.service.firewall.getFirewallList(options, vdcInstanceId);
  }

  @Get('/:vdcInstanceId/ipSets')
  @ApiOperation({ summary: 'Get a list of IP Sets' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: IpSetsDto })
  async getIPSetsList(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Query() query: GetIpSetsListQueryDto,
  ): Promise<IpSetsDto> {
    return await this.service.getIPSetsList(options, vdcInstanceId, query);
  }

  @Get('/:vdcInstanceId/firewalls/:firewallId')
  @ApiOperation({ summary: 'Get a single firewall' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'firewallId', description: 'Firewall ID' })
  async getSingleFirewall(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('firewallId') firewallId: string,
  ): Promise<FirewallListItemDto> {
    return await this.service.firewall.getSingleFirewall(
      options,
      vdcInstanceId,
      firewallId,
    );
  }

  @Get('/:vdcInstanceId/ipSets/:ipSetsId')
  @ApiOperation({ summary: 'Get a single IP Set' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'IPSetId', description: 'IP Set ID' })
  async getSingleIPSet(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSetsId') IPSetId: string,
  ): Promise<IPSetDto> {
    return await this.service.getSingleIPSet(options, vdcInstanceId, IPSetId);
  }

  @Put('/:vdcInstanceId/applicationPortProfiles/:applicationId')
  @ApiOperation({ summary: 'Update an applicationPortProfile' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  async updateApplicationPortProfile(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('applicationId') applicationId: string,
    @Body() data: CreateApplicationPortProfileDto,
  ): Promise<any> {
    return await this.service.applicationPortProfile.updateApplicationPortProfile(
      options,
      vdcInstanceId,
      data,
      applicationId,
    );
  }

  @Put('/:vdcInstanceId/DhcpForwarder')
  @ApiOperation({
    summary: 'Update DHCP Forwarder configuration of an edge gateway',
  })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async updateDhcpForwarderConfig(
    @Request() options,

    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: DhcpForwarderDto,
  ): Promise<any> {
    return await this.service.updateDhcpForwarder(options, data, vdcInstanceId);
  }

  @Put('/:vdcInstanceId/DNS')
  @ApiOperation({ summary: 'Update a DNS Forwarder' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  async updateDnsForwarderConfig(
    @Request() options,

    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: DnsDto,
  ): Promise<any> {
    return await this.service.updateDnsForwarder(options, data, vdcInstanceId);
  }

  @Put('/:vdcInstanceId/firewalls')
  @ApiOperation({ summary: 'Update a list of firewalls' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: TaskReturnDto })
  async updateFirewallList(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Body() data: UpdateFirewallDto,
  ): Promise<TaskReturnDto> {
    return await this.service.firewall.updateFirewallList(
      options,
      vdcInstanceId,
      data,
    );
  }

  @Put('/:vdcInstanceId/ipSets/:ipSetId')
  @ApiOperation({ summary: 'Update an IP Set' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSetId', description: 'IP Set ID' })
  @ApiResponse({ type: TaskReturnDto })
  async updateIPSet(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSetId') ipSetId: string,
    @Body() data: UpdateIpSetsDto,
  ): Promise<TaskReturnDto> {
    return await this.service.updateIPSet(
      options,
      vdcInstanceId,
      ipSetId,
      data,
    );
  }

  @Put('/:vdcInstanceId/firewalls/:firewallId')
  @ApiOperation({ summary: 'Update a single firewall' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'firewallId', description: 'Firewall ID' })
  @ApiResponse({ type: TaskReturnDto })
  async updateSingleFirewall(
    @Request() options: SessionRequest,
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('firewallId') firewallId: string,
    @Body() data: FirewallListItemDto,
  ): Promise<TaskReturnDto> {
    return await this.service.firewall.updateSingleFirewall(
      options,
      vdcInstanceId,
      firewallId,
      data,
    );
  }
}
