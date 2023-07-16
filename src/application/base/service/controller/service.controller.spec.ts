import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateServiceDto } from '../dto/create-service.dto';
import { CreateServiceService } from '../services/create-service.service';

@ApiTags('Services')
@Controller('services')
@ApiBearerAuth() // Requires authentication with a JWT token
export class InvoicesController {
  constructor(private readonly createServiceService: CreateServiceService) {}

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @Request() options: any,
  ): Promise<any> {
    return this.createServiceService.createService(options, dto);
  }
}
