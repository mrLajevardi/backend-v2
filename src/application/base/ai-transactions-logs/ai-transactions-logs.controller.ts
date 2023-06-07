import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';
import { AiTransactionsLogsService } from './ai-transactions-logs.service';
import { CreateAiTransactionsLogsDto } from 'src/application/base/ai-transactions-logs/dto/create-ai-transactions-logs.dto';
import { UpdateAiTransactionsLogsDto } from 'src/application/base/ai-transactions-logs/dto/update-ai-transactions-logs.dto';


@ApiTags('AiTransactionsLogs')
@Controller('ai-transactions-logs')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AiTransactionsLogsController {
  constructor(private readonly service: AiTransactionsLogsService) {}

  // Find an item by id 
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<AiTransactionsLogs> {
    return this.service.findById(id);
  }

  // find items using search criteria 
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<AiTransactionsLogs[]> {
    return this.service.find({});
  }

  // create new item 
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created' })
  @Post()
  async create(@Body() dto: CreateAiTransactionsLogsDto): Promise<void> {
    await this.service.create(dto);
  }

  // update an existing item 
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAiTransactionsLogsDto): Promise<void> {
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
