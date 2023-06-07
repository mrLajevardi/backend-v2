import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGroupsMappings } from 'src/infrastructure/database/entities/PermissionGroupsMappings';
import { PermissionGroupsMappingsService } from './permission-groups-mappings.service';
import { CreatePermissionGroupsMappingsDto } from 'src/application/base/permission-groups-mappings/dto/create-permission-groups-mappings.dto';
import { UpdatePermissionGroupsMappingsDto } from 'src/application/base/permission-groups-mappings/dto/update-permission-groups-mappings.dto';


@ApiTags('PermissionGroupsMappings')
@Controller('permission-groups-mappings')
@ApiBearerAuth() // Requires authentication with a JWT token
export class PermissionGroupsMappingsController {
  constructor(private readonly service: PermissionGroupsMappingsService) {}

  // Find an item by id 
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id : number): Promise<PermissionGroupsMappings> {
    return this.service.findById(id);
  }

  // find items using search criteria 
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<PermissionGroupsMappings[]> {
    return this.service.find({});
  }

  // create new item 
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created' })
  @Post()
  async create(@Body() dto: CreatePermissionGroupsMappingsDto): Promise<void> {
    await this.service.create(dto);
  }

  // update an existing item 
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated' })
  @Put(':id')
  async update(@Param('id') id : number, @Body() dto: UpdatePermissionGroupsMappingsDto): Promise<void> {
    await this.service.update(id, dto);
  }


  //delete an item
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully deleted' })
  @Delete(':id')
  async delete(@Param('id') id : number): Promise<void> {
    await this.service.delete(id);
  }
}
