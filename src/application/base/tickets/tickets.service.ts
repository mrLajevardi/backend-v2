import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from 'src/infrastructure/database/entities/Tickets';
import { CreateTicketDto } from 'src/infrastructure/dto/create/create-ticket.dto';
import { UpdateTicketDto } from 'src/infrastructure/dto/update/update-ticket.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Tickets)
        private readonly repository : Repository<Tickets>
    ){}

    // Find One Item by its ID 
    async findById(id : number) : Promise<Tickets> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Tickets[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Tickets>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateTicketDto){
        const newItem = plainToClass(Tickets, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdateTicketDto){
        const item = await this.findById(id);
        const updateItem : Partial<Tickets> = Object.assign(item,dto);
        await this.repository.save(updateItem);
    }

    // delete an Item
    async delete(id : number){
        await this.repository.delete(id);
    }

    // delete all items 
    async deleteAll(){
        await this.repository.delete({});
    }
}
