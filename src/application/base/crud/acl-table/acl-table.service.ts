
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/test-entities/ACL';
import { CreateACLDto } from './dto/create-acls.dto';
import { UpdateACLDto } from './dto/update-acls.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ACLTableService {
	constructor(
	@InjectRepository(Acl)
	private readonly repository: Repository<Acl>,
	) {}

	// Find One Item by its ID
	async findById(id: number) : Promise<Acl> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<Acl[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<Acl> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateACLDto) {
	const newItem = plainToClass(Acl, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: number, dto: UpdateACLDto) {
	const item = await this.findById(id);
	const updateItem: Partial<Acl> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<Acl>,
	dto: UpdateACLDto,
	) {
	await this.repository.update(where, dto);
	}


	// delete an Item
	async delete(id: number) {
		await this.repository.delete(id);
	}

	// delete all items
	async deleteAll() {
		await this.repository.delete({});
		}
	}
				
				