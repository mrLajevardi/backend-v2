import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Get,
  Inject,
  Param,
  Query,
  Body,
  Put,
} from '@nestjs/common';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { DatacenterConfigGenItemsResultDto } from './dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from './dto/datacenter-config-gen-items.query.dto';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from './interface/datacenter.interface';
import { Public } from '../security/auth/decorators/ispublic.decorator';
import { CreateDatacenterDto } from './dto/create-datacenter.dto';
import { DataCenterList } from './dto/datacenter-list.dto';
import { DatacenterDetails } from './dto/datacenter-details.dto';

@ApiTags('Datacenter')
@Controller('datacenter')
@ApiBearerAuth() // Requires authentication with a JWT token
export class DatacenterController {
  constructor(
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly service: BaseDatacenterService,
  ) {}

  @Public()
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
    const result = await this.service.getDatacenterConfigWithGen();
    return result;
  }

  @Get('/configs/:datacenterId/')
  @Public()
  @ApiResponse({
    type: [DatacenterConfigGenItemsResultDto],
  })
  @ApiOperation({
    summary: 'Return All DatacenterItems with their Configs',
  })
  @ApiParam({
    name: 'datacenterId',
    type: String,
    description: 'DatacenterId about a specify Datacenter',
  })
  @ApiQuery({
    name: 'genId',
    type: String,
    description:
      'GenerationId that is about generation of a specify Datacenter',
    required: false,
  })
  @ApiQuery({
    name: 'serviceTypeId',
    type: String,
    required: false,
  })
  async getDatacenterItemsConfig(
    @Param('datacenterId') datacenterId: string,
    @Query('genId') genId: string,
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

  @Get('/getAllDatacenters')
  @Public()
  async getAllDataCenters(): Promise<DataCenterList[]> {
    const result = await this.service.getAllDataCenters();
    return result;
  }
  @Get('/getDatacenterDetails/:datacenterName')
  @Public()
  async getDatacenterDetails(
    @Param('datacenterName') datacenterName: string,
  ): Promise<DatacenterDetails> {
    const result = await this.service.getDatacenterDetails(datacenterName);
    return result;
  }

  @Get('/defaults')
  @Public()
  async getDatacenterDefault(): // @Param('datacenterName') datacenterName: string,
  Promise<DatacenterDetails> {
    const result = await this.service.getDatacenterConfigs({
      datacenter: null,
    });
    return result;
  }

  @Put()
  async updateDatacenter(@Body() dto: CreateDatacenterDto): Promise<void> {
    return this.service.updateDatacenter(dto);
  }
}
