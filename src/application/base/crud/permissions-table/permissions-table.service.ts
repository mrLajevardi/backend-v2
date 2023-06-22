
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/infrastructure/database/entities/Permissions';
import { CreatePermissionsDto } from './dto/create-permissions.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionsTableService {
	constructor(
	@InjectRepository(Permissions)
	private readonly repository: Repository<Permissions>,
	) {}

	// Find One Item by its ID
	async findById(id: number) : Promise<Permissions> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<Permissions[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<Permissions> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreatePermissionsDto) {
	const newItem = plainToClass(Permissions, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: number, dto: UpdatePermissionsDto) {
	const item = await this.findById(id);
	const updateItem: Partial<Permissions> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<Permissions>,
	dto: UpdatePermissionsDto,
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
				
				