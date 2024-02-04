import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { IpSecVpnService } from '../service/ip-sec-vpn.service';
import { CreateIpSecVpnVdcDto } from '../dto/create-ip-sec-vpn-vdc.dto';
import { TaskReturnDto } from '../../../infrastructure/dto/task-return.dto';
import { UpdateIpSecVpnVdcDto } from '../dto/update-ip-sec-vpn-vdc.dto';
import { UpdateIpSecVpnConnectionPropertyVdcDto } from '../dto/update-ip-sec-vpn-connection-property-vdc.dto';
import {
  IpSecVpnResultDto,
  IpSecVpnResultType,
} from '../dto/result/ip-sec-vpn.result.dto';
import {
  IpSecVpnConnectionPropertyResultDto,
  IpSecVpnConnectionPropertyResultType,
} from '../dto/result/ip-sec-vpn-connection-property.result.dto';
import {
  IpSecVpnStatusResultDto,
  IpSecVpnStatusResultType,
} from '../dto/result/ip-sec-vpn-status.result.dto';
import {
  IpSecVpnStatisticsResultDto,
  IpSecVpnStatisticsResultType,
} from '../dto/result/ip-sec-vpn-statistics.result.dto';

@Controller('ipsec-vpn')
@ApiTags('IpSec Vpn')
@ApiBearerAuth()
export class IpSecVpnController {
  constructor(private readonly ipSecVpnService: IpSecVpnService) {}

  @Get('/:vdcInstanceId')
  @ApiOperation({ summary: 'Get Ip Sec Vpn of Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: IpSecVpnResultType, isArray: true, status: 200 })
  async GetIpSecVpn(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnResultType[]> {
    const data = await this.ipSecVpnService.getIpSecVpnByVdcInstanceId(
      options,
      vdcInstanceId,
    );

    return new IpSecVpnResultDto().collection(data);
  }

  @Get('/:vdcInstanceId/tunnels/:ipSecVpnId')
  @ApiOperation({ summary: 'Find Ip Sec Vpn of Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: IpSecVpnResultType, status: 200 })
  async FindVpnIpSecVpn(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnResultType> {
    const data = await this.ipSecVpnService.findIpSecVpnByVdcInstanceId(
      options,
      vdcInstanceId,
      ipSecVpnId,
    );

    return new IpSecVpnResultDto().toArray(data);
  }

  @Post('/:vdcInstanceId')
  @ApiOperation({ summary: 'Create Ip Sec Vpn for Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: TaskReturnDto })
  async CreateStaticRoute(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Request() options: SessionRequest,
    @Body() dto: CreateIpSecVpnVdcDto,
  ): Promise<TaskReturnDto> {
    return await this.ipSecVpnService.createIpSecVpnByVdcInstanceId(
      options,
      vdcInstanceId,
      dto,
    );
  }

  @Put('/:vdcInstanceId/tunnels/:ipSecVpnId')
  @ApiOperation({ summary: 'Update Ip Sec Vpn of Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: TaskReturnDto })
  async UpdateIpSecVpn(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
    @Body() dto: UpdateIpSecVpnVdcDto,
  ): Promise<TaskReturnDto> {
    return await this.ipSecVpnService.updateIpSecVpnByVdcInstanceId(
      options,
      vdcInstanceId,
      ipSecVpnId,
      dto,
    );
  }

  @Delete('/:vdcInstanceId/tunnels/:ipSecVpnId')
  @ApiOperation({ summary: 'Delete Ip Sec Vpn of Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: TaskReturnDto })
  async DeleteVpnIpSecVpn(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
  ): Promise<TaskReturnDto> {
    return await this.ipSecVpnService.deleteIpSecVpnByVdcInstanceId(
      options,
      vdcInstanceId,
      ipSecVpnId,
    );
  }

  @Get('/:vdcInstanceId/defaultConnectionProperty')
  @ApiOperation({ summary: 'Get Default Connection Property of Service' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiResponse({ type: IpSecVpnConnectionPropertyResultType })
  async GetDefaultConnectionProperty(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnConnectionPropertyResultType> {
    const data = await this.ipSecVpnService.getDefaultConnectionProperty(
      options,
      vdcInstanceId,
    );

    return new IpSecVpnConnectionPropertyResultDto().toArray(data);
  }

  @Get('/:vdcInstanceId/getConnectionProperty/:ipSecVpnId')
  @ApiOperation({ summary: 'Get Connection Property of Ip Sec Vpn' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: IpSecVpnConnectionPropertyResultType })
  async GetIpSecVpnConnectionProperty(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnConnectionPropertyResultType> {
    const data = await this.ipSecVpnService.getIpSecVpnConnectionProperty(
      options,
      vdcInstanceId,
      ipSecVpnId,
    );

    return new IpSecVpnConnectionPropertyResultDto().toArray(data);
  }

  @Get('/:vdcInstanceId/getStatus/:ipSecVpnId')
  @ApiOperation({ summary: 'Get Status of Ip Sec Vpn' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: IpSecVpnStatusResultType })
  async GetIpSecVpnStatus(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnStatusResultType> {
    const data = await this.ipSecVpnService.getIpSecVpnStatus(
      options,
      vdcInstanceId,
      ipSecVpnId,
    );

    return new IpSecVpnStatusResultDto().toArray(data);
  }

  @Get('/:vdcInstanceId/getStatistics/:ipSecVpnId')
  @ApiOperation({ summary: 'Get Statistics of Ip Sec Vpn' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: IpSecVpnStatisticsResultType })
  async GetIpSecVpnStatistics(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
  ): Promise<IpSecVpnStatisticsResultType> {
    const data = await this.ipSecVpnService.getIpSecVpnStatistics(
      options,
      vdcInstanceId,
      ipSecVpnId,
    );

    return new IpSecVpnStatisticsResultDto().toArray(data);
  }

  @Put('/:vdcInstanceId/tunnels/:ipSecVpnId/connectionProperty')
  @ApiOperation({ summary: 'Update Connection Property of IP Sec Vpn' })
  @ApiParam({ name: 'vdcInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'ipSecVpnId', description: 'IP SEC VPN ID' })
  @ApiResponse({ type: TaskReturnDto })
  async UpdateIpSecVpnConnectionProperty(
    @Param('vdcInstanceId') vdcInstanceId: string,
    @Param('ipSecVpnId') ipSecVpnId: string,
    @Request() options: SessionRequest,
    @Body() dto: UpdateIpSecVpnConnectionPropertyVdcDto,
  ): Promise<TaskReturnDto> {
    return await this.ipSecVpnService.updateIpSecVpnConnectionProperty(
      options,
      vdcInstanceId,
      ipSecVpnId,
      dto,
    );
  }
}
