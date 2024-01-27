import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../dto/invoice-calculator.dto';
import { Public } from '../../security/auth/decorators/ispublic.decorator';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { getTransactionsDto } from '../../crud/transactions-table/dto/get-transactions.dto';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { PaygInvoiceService } from '../service/payg-invoice.service';
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { InvoiceDetailBaseDto } from '../../../vdc/dto/invoice-detail-base.dto';
import { InvoiceDetailsQueryDto } from '../dto/invoice-details-query.dto';
import { ForbiddenException } from '../../../../infrastructure/exceptions/forbidden.exception';

@ApiTags('Invoices')
@Controller('invoices')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'get invoice details by id' })
  @ApiResponse({
    status: 200,
    description: 'Return invoice details , it can be ai or vdc',
  })
  @Get('getDetails/:id')
  async getDetails(
    @Param('id') id: number,
    @Query() queryDto: InvoiceDetailsQueryDto,
    @Request() options: SessionRequest,
  ): Promise<InvoiceDetailBaseDto | ForbiddenException> {
    const preFactor =
      queryDto.preFactor === 'true' || queryDto.preFactor === '1';
    return await this.invoiceService.getDetails(
      id.toString(),
      preFactor,
      options,
    );
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
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/upgrade')
  async upgradeAndExtend(
    @Body() dto: UpgradeAndExtendDto,
    @Request() options: SessionRequest,
  ): Promise<InvoiceIdDto> {
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
  @ApiOperation({ summary: 'service invoice calculator' })
  @ApiResponse({
    status: 200,
    description: '',
    type: InvoiceCalculatorResultDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/service/calculator')
  vdcCalculator(
    @Body() dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto> {
    return this.invoiceService.invoiceCalculator(dto);
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
