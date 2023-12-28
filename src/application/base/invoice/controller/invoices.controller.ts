import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { UpdateInvoicesDto } from '../../crud/invoices-table/dto/update-invoices.dto';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import {
  BASE_INVOICE_SERVICE,
  BaseInvoiceService,
} from '../interface/service/invoice.interface';
import {
  VdcInvoiceCalculatorDto,
  VdcInvoiceCalculatorResultDto,
} from '../dto/vdc-invoice-calculator.dto';
import { Public } from '../../security/auth/decorators/ispublic.decorator';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { getTransactionsDto } from '../../crud/transactions-table/dto/get-transactions.dto';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { PaygInvoiceService } from '../service/payg-invoice.service';
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';

@ApiTags('Invoices')
@Controller('invoices')
@ApiBearerAuth() // Requires authentication with a JWT token
export class InvoicesController {
  constructor(
    @Inject(BASE_INVOICE_SERVICE)
    private readonly invoiceService: BaseInvoiceService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly paygInvoiceService: PaygInvoiceService,
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
    return await this.invoiceService.createServiceInvoice(
      dto.serviceType ?? ServiceTypesEnum.Vdc,
      dto,
      options,
    );
  }

  // create new item
  @ApiOperation({ summary: 'Create a payg invoice' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Post('payg')
  async createPayService(
    @Body() dto: CreatePaygVdcServiceDto,
    @Request() options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    return this.paygInvoiceService.createPaygInvoice(
      dto,
      options,
      InvoiceTypes.Create,
    );
  }

  // create new item
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created',
  })
  @Put('/upgrade')
  async upgradeAndExtend(
    @Body() dto: UpgradeAndExtendDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    return this.invoiceService.upgradeAndExtendInvoice(dto, options);
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

  @Public()
  @ApiOperation({ summary: 'vdc invoice calculator' })
  @ApiResponse({
    status: 200,
    description: '',
    type: VdcInvoiceCalculatorResultDto,
  })
  @Post('/vdc/calculator')
  vdcCalculator(
    @Body() dto: VdcInvoiceCalculatorDto,
  ): Promise<VdcInvoiceCalculatorResultDto> {
    return this.invoiceService.vdcInvoiceCalculator(dto);
  }

  @ApiOperation({ summary: 'get transaction' })
  @ApiParam({ type: String, name: 'authorityCode' })
  @ApiResponse({ type: getTransactionsDto })
  @Get('/transactions/:authorityCode')
  async getTransaction(
    @Request() options: SessionRequest,
    @Param('authorityCode') authorityCode: string,
  ): Promise<Transactions> {
    const transaction = await this.invoiceService.getTransaction(
      options,
      authorityCode,
    );
    return transaction;
  }

  @ApiOperation({ summary: 'creates payg upgrade invoice' })
  @ApiResponse({ type: InvoiceIdDto })
  @Put('/payg/upgrade')
  async upgradePayg(
    @Request() options: SessionRequest,
    @Body() dto: CreatePaygVdcServiceDto,
  ): Promise<InvoiceIdDto> {
    const invoiceId = await this.paygInvoiceService.paygUpgradeInvoice(
      dto,
      options,
    );
    return invoiceId;
  }
}
