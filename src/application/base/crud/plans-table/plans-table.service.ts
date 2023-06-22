
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/infrastructure/database/test-entities/Plans';
import { CreatePlansDto } from './dto/create-plans.dto';
import { UpdatePlansDto } from './dto/update-plans.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PlansTableService {
	constructor(
	@InjectRepository(Plans)
	private readonly repository: Repository<Plans>,
	) {}

	// Find One Item by its ID
	async findById(id: string ) : Promise<Plans> {
	const serviceType = await this.repository.findOne({ where: { code: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<Plans[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<Plans> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreatePlansDto) {
	const newItem = plainToClass(Plans, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: string , dto: UpdatePlansDto) {
	const item = await this.findById(id);
	const updateItem: Partial<Plans> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<Plans>,
	dto: UpdatePlansDto,
	) {
	await this.repository.update(where, dto);
	}


	// delete an Item
	async delete(id: string ) {
		await this.repository.delete(id);
	}

	// delete all items
	async deleteAll() {
		await this.repository.delete({});
		}
	}
				
				