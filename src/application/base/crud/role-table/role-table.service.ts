
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/infrastructure/database/entities/Role';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleTableService {
	constructor(
	@InjectRepository(Role)
	private readonly repository: Repository<Role>,
	) {}

	// Find One Item by its ID
	async findById(id: string ) : Promise<Role> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<Role[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<Role> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateRoleDto) {
	const newItem = plainToClass(Role, dto);
	const createdItem = this.repository.create(newItem);
	await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: string , dto: UpdateRoleDto) {
	const item = await this.findById(id);
	const updateItem: Partial<Role> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<Role>,
	dto: UpdateRoleDto,
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
				
				