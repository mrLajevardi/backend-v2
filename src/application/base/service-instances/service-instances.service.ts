import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstancess } from 'src/infrastructure/database/entities/ServiceInstancess';
import { CreateServiceInstancesDto } from 'src/infrastructure/dto/create/create-service-instances.dto';
import { UpdateServiceInstancesDto } from 'src/infrastructure/dto/update/update-service-instances.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServiceInstancessService {
    constructor(
        @InjectRepository(ServiceInstancess)
        private readonly repository : Repository<ServiceInstancess>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<ServiceInstancess> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<ServiceInstancess[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<ServiceInstancess>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateServiceInstancesDto){
        const newItem = plainToClass(ServiceInstancess, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateServiceInstancesDto){
        const item = await this.findById(id);
        const updateItem : Partial<ServiceInstancess> = Object.assign(item,dto);
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
