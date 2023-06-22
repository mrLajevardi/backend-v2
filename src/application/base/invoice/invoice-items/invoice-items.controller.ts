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
import { InvoiceItems } from 'src/infrastructure/database/entities/InvoiceItems';
import { InvoiceItemsService } from './invoice-items.service';
import { CreateInvoiceItemsDto } from 'src/application/base/invoice/invoice-items/dto/create-invoice-items.dto';
import { UpdateInvoiceItemsDto } from 'src/application/base/invoice/invoice-items/dto/update-invoice-items.dto';

@ApiTags('InvoiceItems')
@Controller('invoice-items')
@ApiBearerAuth() // Requires authentication with a JWT token
export class InvoiceItemsController {
  constructor(private readonly service: InvoiceItemsService) {}

  // Find an item by id
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<InvoiceItems> {
    return this.service.findById(id);
  }

  // find items using search criteria
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<InvoiceItems[]> {
    return this.service.find({});
  }

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(@Body() dto: CreateInvoiceItemsDto): Promise<void> {
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
    @Body() dto: UpdateInvoiceItemsDto,
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
