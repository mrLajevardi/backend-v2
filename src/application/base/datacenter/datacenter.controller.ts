import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { DatacenterConfigGenItemsResultDto } from './dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from './dto/datacenter-config-gen-items.query.dto';
import { DatacenterService } from './service/datacenter.service';
import { BaseDatacenterService } from './interface/datacenter.interface';

@ApiTags('Datacenter')
@Controller('datacenter')
@ApiBearerAuth() // Requires authentication with a JWT token
export class DatacenterController {
  constructor(
    @Inject('DatacenterService')
    private readonly service: BaseDatacenterService,
    private readonly datacenterService: DatacenterService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Enabled Datacenters With Their Gens ',
  })
  @ApiResponse({
    status: 200,
    description: 'All Enabled Datacenters With Their Gens',
    type: [DatacenterConfigGenResultDto],
  })
  async getDatacenterWithGens(): Promise<DatacenterConfigGenResultDto[]> {
    const result = await this.datacenterService.getDatacenterConfigWithGen();
    return result;
  }

  @Get('/configs/:datacenterId/:genId/')
  @ApiResponse({
    type: [DatacenterConfigGenItemsResultDto],
  })
  @ApiOperation({
    summary: 'Return All DatacenterItems with their Configs',
  })
  @ApiParam({
    name: 'genId',
    type: String,
    description:
      'GenerationId that is about generation of a specify Datacenter',
  })
  @ApiParam({
    name: 'datacenterId',
    type: String,
    description: 'DatacenterId about a specify Datacenter',
  })
  @ApiQuery({
    name: 'serviceTypeId',
    type: String,
    required: false,
  })
  async getDatacenterItemsConfig(
    @Param('datacenterId') datacenterId: string,
    @Param('genId') genId: string,
    @Query('serviceTypeId') serviceTypeId?: string,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const result: DatacenterConfigGenItemsResultDto[] =
      await this.service.GetDatacenterConfigWithGenItems(
        new DatacenterConfigGenItemsQueryDto(
          datacenterId,
          genId,
          serviceTypeId,
        ),
      );
    return result;
  }
}
