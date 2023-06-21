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
import { PermissionMappings } from 'src/infrastructure/database/entities/PermissionMappings';
import { PermissionMappingsService } from './permission-mappings.service';
import { CreatePermissionMappingDto } from 'src/application/base/security/permission-mappings/dto/create-permission-mapping.dto';
import { UpdatePermissionMappingDto } from 'src/application/base/security/permission-mappings/dto/update-permission-mapping.dto';

@ApiTags('PermissionMappings')
@Controller('permission-mappings')
@ApiBearerAuth() // Requires authentication with a JWT token
export class PermissionMappingsController {
  constructor(private readonly service: PermissionMappingsService) {}

  // Find an item by id
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<PermissionMappings> {
    return this.service.findById(id);
  }

  // find items using search criteria
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<PermissionMappings[]> {
    return this.service.find({});
  }

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(@Body() dto: CreatePermissionMappingDto): Promise<void> {
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
    @Body() dto: UpdatePermissionMappingDto,
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
