
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scope } from 'src/infrastructure/database/entities/Scope';
import { CreateScopeDto } from './dto/create-scope.dto';
import { UpdateScopeDto } from './dto/update-scope.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ScopeTableService {
	constructor(
	@InjectRepository(Scope)
	private readonly repository: Repository<Scope>,
	) {}

	// Find One Item by its ID
	async findById(id: number) : Promise<Scope> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<Scope[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<Scope> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateScopeDto) {
	const newItem = plainToClass(Scope, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: number, dto: UpdateScopeDto) {
	const item = await this.findById(id);
	const updateItem: Partial<Scope> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<Scope>,
	dto: UpdateScopeDto,
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
				
				