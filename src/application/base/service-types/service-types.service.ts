import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { CreateServiceTypesDto } from 'src/application/base/service-types/dto/create-service-types.dto';
import { UpdateServiceTypesDto } from 'src/application/base/service-types/dto/update-service-types.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServiceTypesService {
    constructor(
        @InjectRepository(ServiceTypes)
        private readonly repository : Repository<ServiceTypes>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<ServiceTypes> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<ServiceTypes[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<ServiceTypes>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateServiceTypesDto){
        const newItem = plainToClass(ServiceTypes, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateServiceTypesDto){
        const item = await this.findById(id);
        const updateItem : Partial<ServiceTypes> = Object.assign(item,dto);
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
