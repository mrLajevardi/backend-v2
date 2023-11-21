import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Province} from "../../../../infrastructure/database/entities/Province";
import {FindManyOptions, Repository} from "typeorm";
import {plainToClass} from "class-transformer";
import {CreateProvinceDto} from "./dto/create-province.dto";

@Injectable()
export class ProvinceTableService {
    constructor(
        @InjectRepository(Province)
        private readonly repository: Repository<Province>
    ) {}

    async findById(id: number): Promise<Province | null> {
        return await this.repository.findOne({ where: { id: id } });
    }


    async find(options?: FindManyOptions<Province>): Promise<Province[]> {
        return await this.repository.find(options);
    }

    async count(options?: FindManyOptions<Province>): Promise<number> {
        return await this.repository.count(options);
    }

    async create(dto: CreateProvinceDto): Promise<Province> {
        const newItem = plainToClass(Province, dto);
        const createdItem = this.repository.create(newItem);

        return await this.repository.save(createdItem);
    }
}
