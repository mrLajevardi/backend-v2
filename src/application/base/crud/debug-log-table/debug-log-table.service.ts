
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebugLog } from 'src/infrastructure/database/test-entities/DebugLog';
import { CreateDebugLogDto } from './dto/create-debug-log.dto';
import { UpdateDebugLogDto } from './dto/update-debug-log.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DebugLogTableService {
	constructor(
	@InjectRepository(DebugLog)
	private readonly repository: Repository<DebugLog>,
	) {}

	// Find One Item by its ID
	async findById(id: number) : Promise<DebugLog> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<DebugLog[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<DebugLog> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateDebugLogDto) {
	const newItem = plainToClass(DebugLog, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: number, dto: UpdateDebugLogDto) {
	const item = await this.findById(id);
	const updateItem: Partial<DebugLog> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<DebugLog>,
	dto: UpdateDebugLogDto,
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
				
				