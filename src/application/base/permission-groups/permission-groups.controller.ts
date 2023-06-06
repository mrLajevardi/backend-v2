import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGroups } from 'src/infrastructure/database/entities/PermissionGroups';
import { PermissionGroupsService } from './permission-groups.service';
import { CreatePermissionGroupsDto } from 'src/infrastructure/dto/create/create-permission-groups.dto';
import { UpdatePermissionGroupsDto } from 'src/infrastructure/dto/update/update-permission-groups.dto';


@ApiTags('PermissionGroups')
@Controller('permission-groups')
@ApiBearerAuth() // Requires authentication with a JWT token
export class PermissionGroupsController {
  constructor(private readonly service: PermissionGroupsService) {}

  // Find an item by id 
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PermissionGroups> {
    return this.service.findById(id);
  }

  // find items using search criteria 
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<PermissionGroups[]> {
    return this.service.find({});
  }

  // create new item 
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created' })
  @Post()
  async create(@Body() dto: CreatePermissionGroupsDto): Promise<void> {
    await this.service.create(dto);
  }

  // update an existing item 
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionGroupsDto): Promise<void> {
    await this.service.update(id, dto);
  }


  //delete an item
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully deleted' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
