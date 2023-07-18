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
import { CreateServiceService } from '../services/create-service.service';
import { CreateServiceDto } from '../dto/create-service.dto';

@ApiTags('Services')
@Controller('services')
@ApiBearerAuth() // Requires authentication with a JWT token
export class ServiceController {
  constructor(private readonly createService: CreateServiceService) {}

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @Request() options: any,
  ): Promise<any> {
    return this.createService.createService(options, dto);
    // await this.invoicesTable.create(dto);
  }
}
