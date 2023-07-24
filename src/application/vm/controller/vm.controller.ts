import {
    Controller,
    Get,
    Param,
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

@ApiTags('VM')
@Controller('VM')
@UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VgpuController {
    constructor(

    ) { }

    @ApiOperation({ summary: '' })
    @ApiResponse({
        status: 200,
        description: 'acquire vm tickets',
        type: 'array',
    })
    @Get('/acquireVMTicket')
    async acquireVMTicket(
        @Query('vAppId') vAppId: string,
        @Query('serviceInstanceId') serviceInstanceId: string
    ): Promise<any> {

    }
}