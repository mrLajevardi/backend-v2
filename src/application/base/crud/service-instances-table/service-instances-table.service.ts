
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { CreateServiceInstancesDto } from './dto/create-service-instances.dto';
import { UpdateServiceInstancesDto } from './dto/update-service-instances.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServiceInstancesTableService {
	constructor(
	@InjectRepository(ServiceInstances)
	private readonly repository: Repository<ServiceInstances>,
	) {}

	// Find One Item by its ID
	async findById(id: string ) : Promise<ServiceInstances> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<ServiceInstances[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<ServiceInstances> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateServiceInstancesDto) : Promise<ServiceInstances> {
	const newItem = plainToClass(ServiceInstances, dto);
	const createdItem = this.repository.create(newItem);
	return await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: string , dto: UpdateServiceInstancesDto) {
	const item = await this.findById(id);
	const updateItem: Partial<ServiceInstances> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<ServiceInstances>,
	dto: UpdateServiceInstancesDto,
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
				
				