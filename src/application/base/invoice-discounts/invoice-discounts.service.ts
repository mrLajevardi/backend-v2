import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceDiscounts } from 'src/infrastructure/database/entities/InvoiceDiscounts';
import { CreateInvoiceDiscountsDto } from 'src/infrastructure/dto/create/create-invoice-discounts.dto';
import { UpdateInvoiceDiscountsDto } from 'src/infrastructure/dto/update/update-invoice-discounts.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InvoiceDiscountsService {
    constructor(
        @InjectRepository(InvoiceDiscounts)
        private readonly repository : Repository<InvoiceDiscounts>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<InvoiceDiscounts> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<InvoiceDiscounts[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<InvoiceDiscounts>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateInvoiceDiscountsDto){
        const newItem = plainToClass(InvoiceDiscounts, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateInvoiceDiscountsDto){
        const item = await this.findById(id);
        const updateItem : Partial<InvoiceDiscounts> = Object.assign(item,dto);
        await this.repository.save(updateItem);
    }

    // delete an Item
    async delete(id : string){
        await this.repository.delete(id);
    }

    // delete all items 
    async deleteAll(){
        await this.repository.delete({});
    }
}
