import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterConfigGenItemsResultDto } from './dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from './dto/datacenter-config-gen-items.query.dto';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { Response } from 'express';
import { IDatacenterService } from './interface/IDatacenter.service';

@ApiTags('Datacenter')
@Controller('datacenter')
@ApiBearerAuth() // Requires authentication with a JWT token
export class DatacenterController {
  constructor(
    @Inject('IDatacenterService')
    private readonly service: IDatacenterService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Enabled Datacenters With Their Gens ',
  })
  async getDatacenterWithGens(): Promise<DatacenterConfigGenResultDto[]> {
    const result = await this.service.GetDatacenterConfigWithGen();
    return result;
  }

  @Get('/:datacenterId/:genId/configs')
  @ApiOperation({
    summary: 'Return All DatacenterItems with their Configs',
  })
  @ApiParam({
    name: 'GenId',
    description:
      'GenerationId that is about generation of a specify Datacenter',
  })
  @ApiParam({
    name: 'DatacenterId',
    description: 'DatacenterId about a specify Datacenter',
  })
  async getDatacenterItemsConfig(
    @Param('DatacenterId') DatacenterId: string,
    @Param('GenId') GenId: string,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const result: DatacenterConfigGenItemsResultDto[] =
      await this.service.GetDatacenterConfigWithGenItems(
        new DatacenterConfigGenItemsQueryDto(DatacenterId, GenId),
      );
    return result;
  }
}
