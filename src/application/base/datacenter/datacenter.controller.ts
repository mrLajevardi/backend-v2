import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { DatacenterConfigGenResultDto } from './dto/datacenter-config-gen.result.dto';
import { DatacenterService } from './service/datacenter.service';

@ApiTags('Datacenter')
@Controller('datacenter')
@ApiBearerAuth() // Requires authentication with a JWT token
export class DatacenterController {
  constructor(private readonly service: DatacenterService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Enabled Datacenters With Their Gens ',
  })
  async getDatacenterWithGens(): Promise<DatacenterConfigGenResultDto[]> {
    const result = await this.service.GetDatacenterConfigWithGen();
    return result;
  }
}
