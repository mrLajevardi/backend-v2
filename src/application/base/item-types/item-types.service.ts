import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { CreateItemTypesDto } from 'src/infrastructure/dto/create/create-item-types.dto';
import { UpdateItemTypesDto } from 'src/infrastructure/dto/update/update-item-types.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ItemTypesService {
    constructor(
        @InjectRepository(ItemTypes)
        private readonly repository : Repository<ItemTypes>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<ItemTypes> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<ItemTypes[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<ItemTypes>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateItemTypesDto){
        const newItem = plainToClass(ItemTypes, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateItemTypesDto){
        const item = await this.findById(id);
        const updateItem : Partial<ItemTypes> = Object.assign(item,dto);
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
