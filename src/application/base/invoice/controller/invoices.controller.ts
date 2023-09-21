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
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { InvoicesService } from '../service/invoices.service';
import { UpdateInvoicesDto } from '../../crud/invoices-table/dto/update-invoices.dto';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';

@ApiTags('Invoices')
@Controller('invoices')
@ApiBearerAuth() // Requires authentication with a JWT token
export class InvoicesController {
  constructor(
    private readonly service: InvoicesService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly invoiceService: InvoicesService,
  ) {}

  // Find an item by id
  @ApiOperation({ summary: 'Find an item by ID' })
  @ApiResponse({ status: 200, description: 'Return the found item' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Invoices> {
    return this.invoicesTable.findById(id);
  }

  // find items using search criteria
  @ApiOperation({ summary: 'Find items using search criteria' })
  @ApiResponse({ status: 200, description: 'Return the found items' })
  @Get()
  async findAll(): Promise<Invoices[]> {
    return this.invoicesTable.find({});
  }

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post()
  async create(
    @Body() dto: CreateServiceInvoiceDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return this.invoiceService.createInvoice();
    // await this.invoicesTable.create(dto);
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
    @Body() dto: UpdateInvoicesDto,
  ): Promise<void> {
    await this.invoicesTable.update(id, dto);
  }

  //delete an item
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully deleted',
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.invoicesTable.delete(id);
  }
}
