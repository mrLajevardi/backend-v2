import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseFilters,
  Body
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { Raw } from 'typeorm';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { VmService } from '../service/vm.service';
import { CreateTemplateDto } from '../dto/create-template.dto';

@ApiTags('VM')
@Controller('VM')
@UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post('/:serviceInstanceId/:vmId/acquireVMTicket')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'vmId', description: 'vm id' })
  @ApiResponse({
    status: 201,
    description: 'acquire vm tickets',
    type: 'object',
  })
  async acquireVMTicket(
    @Param('vmId') vmId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.acquireVMTicket(options, serviceInstanceId, vmId);
  }

  @Post('/:serviceInstanceId/:containerId/createTemplate')
  @ApiOperation({ summary: '' })
  @ApiParam({ name: 'serviceInstanceId', description: 'VDC instance ID' })
  @ApiParam({ name: 'containerId', description: 'container id of a vm' })
  @ApiResponse({
    status: 201,
    description: 'create template from vm',
    type: 'object',
  })
  async createTemplate(
    @Param('containerId') containerId: string,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
    @Body() data: CreateTemplateDto,
  ): Promise<any> {
    return this.vmService.createTemplate(options, serviceInstanceId, containerId, data);
  }
}
