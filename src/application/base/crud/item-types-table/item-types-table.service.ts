import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemTypes } from 'src/infrastructure/database/test-entities/ItemTypes';
import { CreateItemTypesDto } from './dto/create-item-types.dto';
import { UpdateItemTypesDto } from './dto/update-item-types.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ItemTypesTableService {
	constructor(
	@InjectRepository(ItemTypes)
	private readonly repository: Repository<ItemTypes>,
	) {}

	// Find One Item by its ID
	async findById(id: number) : Promise<ItemTypes> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<ItemTypes[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<ItemTypes> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateItemTypesDto) {
	const newItem = plainToClass(ItemTypes, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: number, dto: UpdateItemTypesDto) {
	const item = await this.findById(id);
	const updateItem: Partial<ItemTypes> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<ItemTypes>,
	dto: UpdateItemTypesDto,
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
				
				