import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from 'src/infrastructure/database/entities/Setting';
import { CreateSettingDto } from 'src/infrastructure/dto/create/create-setting.dto';
import { UpdateSettingDto } from 'src/infrastructure/dto/update/update-setting.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SettingService {
    constructor(
        @InjectRepository(Setting)
        private readonly repository : Repository<Setting>
    ){}

    // Find One Item by its ID 
    async findById(id : number) : Promise<Setting> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Setting[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Setting>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateSettingDto){
        const newItem = plainToClass(Setting, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdateSettingDto){
        const item = await this.findById(id);
        const updateItem : Partial<Setting> = Object.assign(item,dto);
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
