import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { Raw } from 'typeorm';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { VmService } from '../service/vm.service';

@ApiTags('VM')
@Controller('VM')
@UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 204,
    description: 'acquire vm tickets',
    type: 'object',
  })
  @Post('/acquireVMTicket')
  async acquireVMTicket(
    @Query('vAppId') vAppId: string,
    @Query('serviceInstanceId') serviceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    return this.vmService.acquireVMTicket(options, serviceInstanceId, vAppId);
  }
}
