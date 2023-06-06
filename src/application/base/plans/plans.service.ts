import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { CreatePlanDto } from 'src/infrastructure/dto/create/create-plan.dto';
import { UpdatePlanDto } from 'src/infrastructure/dto/update/update-plan.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plans)
        private readonly repository : Repository<Plans>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<Plans> {
        const serviceType = await this.repository.findOne({ where: {code : id }})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Plans[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Plans>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreatePlanDto){
        const newItem = plainToClass(Plans, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdatePlanDto){
        const item = await this.findById(id);
        const updateItem : Partial<Plans> = Object.assign(item,dto);
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
