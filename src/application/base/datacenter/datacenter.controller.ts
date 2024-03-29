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
  Request,
  Provider,
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
import { GetDatacenterConfigsQueryDto } from './dto/get-datacenter-configs.dto';
import { ServicePlanTypeEnum } from '../service/enum/service-plan-type.enum';
import { PolicyHandlerOptions } from '../security/ability/interfaces/policy-handler.interface';
import { PureAbility, subject } from '@casl/ability';
import { AclSubjectsEnum } from '../security/ability/enum/acl-subjects.enum';
import { Action } from '../security/ability/enum/action.enum';
import { CheckPolicies } from '../security/ability/decorators/check-policies.decorator';
import { AdminVdcWrapperService } from '../../../wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { VdcDetailService } from '../../vdc/service/vdc-detail.service';
import { ProviderResultDto } from './dto/provider.result.dto';

@ApiTags('Datacenter')
@Controller('datacenter')
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Datacenter, props)),
// )
@ApiBearerAuth() // Requires authentication with a JWT token
export class DatacenterController {
  constructor(
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly service: BaseDatacenterService, // private readonly adminVdcWrapperService: AdminVdcWrapperService,
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
  @ApiQuery({
    name: 'datacenterName',
    type: String,
    description: 'datacenterName',
    required: false,
  })
  @ApiQuery({
    name: 'filterEnabled',
    type: Boolean,
    example: true,
    required: true,
  })
  async getDatacenterWithGens(
    @Query('datacenterName') datacenterName?: string,
    @Query('filterEnabled') filterEnabled?: string,
  ): Promise<DatacenterConfigGenResultDto[]> {
    const result = await this.service.getDatacenterConfigWithGen(
      datacenterName,
      JSON.parse(filterEnabled ?? 'true'),
    );
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
  @ApiQuery({
    name: 'servicePlanType',
    enum: ServicePlanTypeEnum,
    required: true,
  })
  async getDatacenterItemsConfig(
    @Param('datacenterId') datacenterId: string,
    @Query('genId') genId: string,
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('servicePlanType') servicePlanType?: ServicePlanTypeEnum,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const result: DatacenterConfigGenItemsResultDto[] =
      await this.service.GetDatacenterConfigWithGenItems(
        new DatacenterConfigGenItemsQueryDto(
          datacenterId,
          genId,
          serviceTypeId,
          servicePlanType,
        ),
      );
    return result;
  }

  @Get('/groupedConfiguration')
  @ApiOperation({
    summary: 'return grouped by Datacenter configurations',
  })
  @ApiResponse({
    type: CreateDatacenterDto,
  })
  async getDatacenterDefault(
    @Query() query: GetDatacenterConfigsQueryDto,
  ): Promise<CreateDatacenterDto> {
    const result = await this.service.getDatacenterConfigs(query);
    return result;
  }

  @Put()
  @ApiOperation({
    summary: 'updates datacenter configs',
  })
  async updateDatacenter(@Body() dto: CreateDatacenterDto): Promise<void> {
    return this.service.updateDatacenter(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'creates a datacenter',
  })
  async createDatacenter(@Body() dto: CreateDatacenterDto): Promise<void> {
    return this.service.createDatacenter(dto);
  }
  @Get('/allProviders')
  @ApiOperation({
    summary: 'get all providers',
  })
  async getAllProviders(): Promise<ProviderResultDto[]> {
    const providerVdcsList = await this.service.getAllProviders();
    return providerVdcsList;
  }

  @Get('/getAllProvidersStorage')
  @ApiOperation({ summary: 'getAllProvidersStorage' })
  async getAllProvidersStorage(
    @Request()
    options: SessionRequest,
  ): Promise<{ name: string; code: string }[]> {
    return this.service.getAllStorageProvider();
  }
}
