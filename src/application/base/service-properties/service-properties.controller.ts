import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { ServicePropertiesService } from './service-properties.service';
import { CreateServicePropertiesDto } from 'src/application/base/service-properties/dto/create-service-properties.dto';
import { UpdateServicePropertiesDto } from 'src/application/base/service-properties/dto/update-service-properties.dto';

@ApiTags('ServiceProperties')
@Controller('service-properties')
@ApiBearerAuth() // Requires authentication with a JWT token
export class ServicePropertiesController {
  constructor(private readonly service: ServicePropertiesService) {}

  // Find an item by id
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<ServiceProperties> {
    return this.service.findById(id);
  }

  // find items using search criteria
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<ServiceProperties[]> {
    return this.service.find({});
  }

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(@Body() dto: CreateServicePropertiesDto): Promise<void> {
    await this.service.create(dto);
  }

  // update an existing item
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateServicePropertiesDto,
  ): Promise<void> {
    await this.service.update(id, dto);
  }

  //delete an item
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully deleted',
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.service.delete(id);
  }
}
