import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoices)
        private readonly invoiceRepository : Repository<Invoices>
    ){}

    // Create a new Invoice  record
    async create(data: Partial<Invoices>): Promise<Invoices> {
        const invoice = this.invoiceRepository.create(data);
        return await this.invoiceRepository.save(invoice);
    }


    // Find an Invoice record by ID
    async findById(id: number): Promise<Invoices | undefined> {
        return await this.invoiceRepository.findOne({ where : {id : id} });
    }
}
