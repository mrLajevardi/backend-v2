import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfoLog } from 'src/infrastructure/database/entities/InfoLog';
import { CreateInfoLogDto } from 'src/infrastructure/dto/create/create-info-log.dto';
import { UpdateInfoLogDto } from 'src/infrastructure/dto/update/update-info-log.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InfoLogService {
    constructor(
        @InjectRepository(InfoLog)
        private readonly repository : Repository<InfoLog>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<InfoLog> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<InfoLog[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<InfoLog>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateInfoLogDto){
        const newItem = plainToClass(InfoLog, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateInfoLogDto){
        const item = await this.findById(id);
        const updateItem : Partial<InfoLog> = Object.assign(item,dto);
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
