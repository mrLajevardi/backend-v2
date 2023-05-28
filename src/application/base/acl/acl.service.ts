import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { FindManyOptions, Repository } from 'typeorm';
import { WhereClause } from 'typeorm/query-builder/WhereClause';

@Injectable()
export class AclService {
    constructor(
        @InjectRepository(Acl)
        private readonly aclRepository : Repository<Acl>
    ){}

    // Create a new Acl record
    async create(aclData: Partial<Acl>): Promise<Acl> {
        const acl = this.aclRepository.create(aclData);
        return await this.aclRepository.save(acl);
    }

    // Find an Acl record by ID
    async findById(id: number): Promise<Acl | undefined> {
        return await this.aclRepository.findOne({ where : {id : id} });
    }

    // conditional find 
    async find(condition: FindManyOptions): Promise<Acl[]> {
        return await this.aclRepository.find(condition); 
    }

    // Find all Acl records
    async findAll(): Promise<Acl[]> {
        return await this.aclRepository.find();
    }

    // Update an existing Acl record
    async update(id: number, aclData: Partial<Acl>): Promise<Acl | undefined> {
        const acl = await this.findById(id);
        if (acl) {
            Object.assign(acl, aclData);
            return await this.aclRepository.save(acl);
        }
        return undefined;
    }

    // Delete an Acl record
    async delete(id: number): Promise<boolean> {
        const result = await this.aclRepository.delete(id);
        return result.affected === 1;
    }

    // Flush the db
    async deleteAll() {
        await this.aclRepository.delete({});
    }

}
