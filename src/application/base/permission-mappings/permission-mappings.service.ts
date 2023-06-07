import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionMappings } from 'src/infrastructure/database/entities/PermissionMappings';
import { CreatePermissionMappingDto } from 'src/application/base/permission-mappings/dto/create-permission-mapping.dto';
import { UpdatePermissionMappingDto } from 'src/application/base/permission-mappings/dto/update-permission-mapping.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionMappingsService {
    constructor(
        @InjectRepository(PermissionMappings)
        private readonly repository : Repository<PermissionMappings>
    ){}

    // Find One Item by its ID 
    async findById(id : number) : Promise<PermissionMappings> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<PermissionMappings[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<PermissionMappings>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreatePermissionMappingDto){
        const newItem = plainToClass(PermissionMappings, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdatePermissionMappingDto){
        const item = await this.findById(id);
        const updateItem : Partial<PermissionMappings> = Object.assign(item,dto);
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
